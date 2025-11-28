const certificateModel = require("../models/certificateModel");
const {
  searchMetadataByKeyvalues,
  getPinataMetadataByCID,
} = require("../services/ipfs.service");
const {
  getCertificateByHash: readByHash,
  getStudentCertificatesByStudent: readByStudent,
} = require("../services/ethers.service");
const config = require("../configs/config");
const {
  toPlain,
  structureCertificateData,
  structureCertificateList,
  verifyCertificateBySignature,
} = require("../utils/helper");

/**
 * Tạo bản ghi chứng chỉ trong cơ sở dữ liệu (KHÔNG phát hành on-chain).
 * @param {import('express').Request} req - Body chứa dữ liệu chứng chỉ
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const createCertificate = async (req, res) => {
  try {
    const certificateData = req.body;
    if (!certificateData) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const savedCertificate = await certificateModel.createCertificate(
      certificateData
    );
    res.status(201).json({
      message: "Certificate created successfully!",
      certificate: savedCertificate,
    });
  } catch (error) {
    console.error("Error creating certificate:", error);
    res.status(500).json({ error: "Failed to create certificate" });
  }
};

/**
 * Phát hành chứng chỉ: upload metadata JSON lên Pinata/IPFS,
 * gọi smart contract để phát hành với metadataURI, sau đó lưu chứng chỉ vào DB
 * @param {import('express').Request} req - JSON body: { courseId }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const issueCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.userId;

    // Input validation
    if (!studentId || !courseId) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
        required: ["studentId", "courseId"],
      });
    }

    // Use the complete issuance function from model
    const result = await certificateModel.issueCertificate(studentId, courseId);

    return res.status(201).json({
      isSuccess: true,
      message: "Certificate issued successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return res.status(500).json({
      error: "Failed to issue certificate",
      details: error.message,
    });
  }
};

/**
 * Lấy thông tin chứng chỉ theo certHash - XÁC THỰC BẰNG CHỮ KÝ
 *
 * 1. Lấy metadata từ IPFS (có signature)
 * 2. Verify signature -> nếu valid = TRUSTED (không cần so sánh 3 nguồn)
 * 3. Lấy thêm DB/Blockchain để tăng độ uy tín
 * 4. Cross-validation chỉ để DETECT sync issues (warning, không reject)
 *
 * @param {import('express').Request} req - params: { hash }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getCertificateByHash = async (req, res, next) => {
  try {
    const hash = req.params.hash;
    if (!hash) {
      return res
        .status(400)
        .json({ error: "Missing certificate's hash fields" });
    }

    // 1. Lấy dữ liệu từ database (để có metadataCID)
    let mongoCert = null;
    try {
      mongoCert = await certificateModel.findCertificateByCertHash(hash);
    } catch (err) {
      console.error("MongoDB read error:", err.message);
    }

    // 2. Lấy dữ liệu từ IPFS (có signature)
    let pinataMetadata = null;
    try {
      if (mongoCert?.ipfs?.metadataCID) {
        pinataMetadata = await getPinataMetadataByCID(
          mongoCert.ipfs.metadataCID
        );
      }
    } catch (err) {
      console.error("Pinata read error:", err.message);
    }

    // 3. Lấy dữ liệu từ blockchain (optional - để cross-check)
    let blockchainCert = null;
    try {
      const rawBlockchainCert = await readByHash(hash);
      blockchainCert = structureCertificateData(rawBlockchainCert);
    } catch (err) {
      console.error("Blockchain read error:", err.message);
    }

    // 4. Xác thực chữ ký
    const verificationResult = verifyCertificateBySignature({
      mongoCert,
      blockchainCert,
      pinataMetadata,
    });

    // 5. Chuẩn bị response payload
    const certificatePayload = {
      ...mongoCert,
      verification: verificationResult.verification,
      trustLevel: verificationResult.trustLevel,
      warnings: verificationResult.warnings,
      errors: verificationResult.errors,
      // metadata từ IPFS (source of truth)
      ipfsMetadata: pinataMetadata,
      // blockchain snapshot (reference)
      blockchainSnapshot: blockchainCert,
    };

    // 6. Trả về kết quả dựa trên trust level
    if (verificationResult.trustLevel === "rejected") {
      return res.status(403).json({
        certificate: null,
        message:
          "Certificate verification failed - signature invalid or missing",
        ...verificationResult,
      });
    }

    if (verificationResult.trustLevel === "warning") {
      return res.status(200).json({
        certificate: certificatePayload,
        message:
          "Certificate is valid (signature verified) but has sync warnings",
      });
    }

    // Trust level = "trusted"
    return res.json({
      certificate: certificatePayload,
      message: "Certificate verified successfully",
    });
  } catch (error) {
    console.error("Can not find certificate by hash: ", error);
    next(error);
  }
};

/**
 * Lấy thông tin chứng chỉ theo certCode - XÁC THỰC BẰNG CHỮ KÝ
 *
 * @param {import('express').Request} req - params: { certificateCode }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getCertificateByCode = async (req, res, next) => {
  try {
    const certificateCode = req.params.certificateCode;

    if (!certificateCode) {
      return res.status(400).json({ error: "Missing certificate code" });
    }

    // 1. Tìm chứng chỉ trong DB
    const mongoCert = await certificateModel.findCertificateByCertCode(
      certificateCode
    );
    if (!mongoCert) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const certificateHash = mongoCert.blockchain.certificateHash;
    if (
      !certificateHash ||
      certificateHash.length !== 66 ||
      !certificateHash.startsWith("0x")
    ) {
      return res.status(400).json({ error: "Invalid certificate hash format" });
    }

    // 2. Lấy metadata từ IPFS (có signature)
    let pinataMetadata = null;
    try {
      if (mongoCert.ipfs?.metadataCID) {
        pinataMetadata = await getPinataMetadataByCID(
          mongoCert.ipfs.metadataCID
        );
      }
    } catch (err) {
      console.error("Pinata read error:", err.message);
    }

    // 3. Lấy dữ liệu từ blockchain (optional)
    let blockchainCert = null;
    try {
      const rawBlockchainCert = await readByHash(certificateHash);
      blockchainCert = structureCertificateData(rawBlockchainCert);
    } catch (err) {
      console.error("Blockchain read error:", err.message);
    }

    // 4. Xác thực chữ ký
    const verificationResult = verifyCertificateBySignature({
      mongoCert,
      blockchainCert,
      pinataMetadata,
    });

    // 5. Chuẩn bị response
    const certificatePayload = {
      ...mongoCert,
      verification: verificationResult.verification,
      trustLevel: verificationResult.trustLevel,
      warnings: verificationResult.warnings,
      errors: verificationResult.errors,
      ipfsMetadata: pinataMetadata,
      blockchainSnapshot: blockchainCert,
    };

    // 6. Trả về kết quả
    if (verificationResult.trustLevel === "rejected") {
      return res.status(403).json({
        certificate: null,
        message: "Certificate verification failed",
        ...verificationResult,
      });
    }

    if (verificationResult.trustLevel === "warning") {
      return res.status(200).json({
        certificate: certificatePayload,
        message: "Certificate is valid but has sync warnings",
      });
    }

    return res.json({
      certificate: certificatePayload,
      message: "Certificate verified successfully",
    });
  } catch (error) {
    console.error("Can not find certificate by code: ", error);
    next(error);
  }
};

/**
 * Lấy danh sách chứng chỉ của một sinh viên theo địa chỉ ví on-chain.
 * Trả về { total, list } trong đó BigInt đã được chuyển sang string (toPlain).
 * @param {import('express').Request} req - params: { address }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getStudentCertificatesByStudent = async (req, res, next) => {
  try {
    const studentAddress = req.params.address;

    if (!studentAddress) {
      return res
        .status(400)
        .json({ error: "Missing student's address fields" });
    }
    const [list, total] = await readByStudent(studentAddress);
    const structuredList = structureCertificateList(toPlain(list));

    const sortedList = structuredList.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.updatedAt || 0);
      const bDate = new Date(b.createdAt || b.updatedAt || 0);
      return bDate - aDate;
    });

    return res.json({
      total: Number(total),
      certificates: sortedList,
    });
  } catch (error) {
    console.error("Can not get list certificates by student: ", error);
    next(error);
  }
};

/**
 * Lấy danh sách chứng chỉ của sinh viên - XÁC THỰC BẰNG CHỮ KÝ
 *
 * 1. Ưu tiên lấy từ database (nhanh nhất)
 * 2. Với mỗi certificate, verify signature từ IPFS
 * 3. Chỉ trả về certificates có signature hợp lệ
 * 4. Fallback: Lấy trực tiếp từ Pinata nếu DB fail
 *
 * @param {import('express').Request} req - params: { address }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getStudentCertificatesHybrid = async (req, res, next) => {
  try {
    const { address } = req.params;
    const studentId = req.user.userId || address;

    const sortByIssueDateDesc = (a, b) => {
      const aDate = new Date(a.validity?.issueDate || 0);
      const bDate = new Date(b.validity?.issueDate || 0);
      return bDate - aDate;
    };

    // 1. Lấy từ database trước
    try {
      const dbCertificates =
        // await certificateModel.findCertificatesByStudentAddress(address);
        await certificateModel.getCertificateByStudentId(studentId);

      if (dbCertificates && dbCertificates.length > 0) {
        // Verify signature cho từng certificate
        const verifiedCertificates = await Promise.all(
          dbCertificates.map(async (cert) => {
            let pinataMetadata = null;
            let verificationResult = null;

            try {
              if (cert.ipfs?.metadataCID) {
                pinataMetadata = await getPinataMetadataByCID(
                  cert.ipfs.metadataCID
                );

                verificationResult = verifyCertificateBySignature({
                  mongoCert: cert,
                  blockchainCert: null,
                  pinataMetadata,
                });
              }
            } catch (err) {
              console.error(
                `Failed to verify certificate ${cert.certificateCode}:`,
                err.message
              );
            }

            return {
              ...cert,
              verification: verificationResult
                ? {
                    signature: verificationResult.verification.signature,
                    trustLevel: verificationResult.trustLevel,
                    status: getTrustLevelStatus(verificationResult.trustLevel),
                    warnings: verificationResult.warnings,
                    errors: verificationResult.errors,
                  }
                : {
                    signature: {
                      isValid: false,
                      message: "Metadata not found",
                    },
                    trustLevel: "unknown",
                    status: getTrustLevelStatus("unknown"),
                    errors: ["Cannot verify signature - metadata not found"],
                  },
            };
          })
        );

        // Phân loại certificates theo trust level
        const trusted = verifiedCertificates.filter(
          (cert) => cert.verification.trustLevel === "trusted"
        );
        const warning = verifiedCertificates.filter(
          (cert) => cert.verification.trustLevel === "warning"
        );
        const rejected = verifiedCertificates.filter(
          (cert) =>
            cert.verification.trustLevel === "rejected" ||
            cert.verification.trustLevel === "unknown"
        );

        const sortedVerifiedCertificates =
          verifiedCertificates.sort(sortByIssueDateDesc);

        return res.json({
          total: sortedVerifiedCertificates.length,
          certificates: sortedVerifiedCertificates, // Trả về tất cả, kể cả rejected
          source: "database",
          verificationSummary: {
            total: dbCertificates.length,
            trusted: trusted.length,
            warning: warning.length,
            rejected: rejected.length,
            byTrustLevel: {
              trusted,
              warning,
              rejected,
            },
          },
        });
      }
    } catch (dbError) {
      console.error("Database query failed:", dbError.message);
    }

    // 2. Fallback: Lấy từ Pinata và verify signature
    //  studentWalletAddress: { value: String(address).toLowerCase(), op: "eq", },
    const keyvalues = {
      studentId: { value: String(studentId), op: "eq" },
    };

    console.log(keyvalues);

    const pinataCerts = await searchMetadataByKeyvalues(keyvalues, 100, 0);

    const verifiedPinataCertificates = await Promise.all(
      pinataCerts.map(async (cert) => {
        try {
          const metadata = await getPinataMetadataByCID(cert.cid);

          // Verify signature
          const verificationResult = verifyCertificateBySignature({
            mongoCert: null,
            blockchainCert: null,
            pinataMetadata: metadata,
          });

          // Lấy blockchain info từ Pinata keyvalues (nếu có)
          const certHash = cert.metadata?.keyvalues?.certificateHash || null;
          const txHash = cert.metadata?.keyvalues?.transactionHash || null;

          // Trả về tất cả certificates, kể cả rejected
          return {
            certificateCode: metadata.certCode,
            student: {
              id: metadata.student.id,
              name: metadata.student.name,
              walletAddress: metadata.student.walletAddress,
            },
            course: {
              id: metadata.course.id,
              title: metadata.course.title,
              type: metadata.course.type,
              level: metadata.course.level,
            },
            issuer: {
              walletAddress: metadata.issuer.walletAddress,
              name: metadata.issuer.name,
            },
            validity: {
              issueDate: metadata.validity.issueDate,
              expireDate: metadata.validity.expireDate,
              isRevoked: metadata.validity.isRevoked,
            },
            blockchain: {
              transactionHash: txHash,
              certificateHash: certHash,
              network:
                cert.metadata?.keyvalues?.network ||
                metadata.blockchain.network ||
                "Sepolia",
            },
            ipfs: {
              metadataCID: cert.cid,
              metadataURI: `ipfs://${cert.cid}`,
              metadataGatewayURL: cert.gateway,
            },
            verification: {
              signature: verificationResult.verification.signature,
              trustLevel: verificationResult.trustLevel,
              status: getTrustLevelStatus(verificationResult.trustLevel),
              warnings: verificationResult.warnings,
              errors: verificationResult.errors,
            },
            createdAt: cert.date_pinned ? new Date(cert.date_pinned) : null,
            updatedAt: cert.date_pinned ? new Date(cert.date_pinned) : null,
          };
        } catch (err) {
          console.error(
            `Failed to verify certificate ${cert.cid}:`,
            err.message
          );
          // Trả về certificate với error state thay vì null
          return {
            certificateCode: cert.cid,
            verification: {
              signature: { isValid: false, message: err.message },
              trustLevel: "unknown",
              status: getTrustLevelStatus("unknown"),
              errors: [err.message],
            },
            ipfs: {
              metadataCID: cert.cid,
              metadataURI: `ipfs://${cert.cid}`,
            },
          };
        }
      })
    );

    // Phân loại certificates
    const trusted = verifiedPinataCertificates.filter(
      (cert) => cert.verification.trustLevel === "trusted"
    );
    const warning = verifiedPinataCertificates.filter(
      (cert) => cert.verification.trustLevel === "warning"
    );
    const rejected = verifiedPinataCertificates.filter(
      (cert) =>
        cert.verification.trustLevel === "rejected" ||
        cert.verification.trustLevel === "unknown"
    );

    const sortedPinataCertificates =
      verifiedPinataCertificates.sort(sortByIssueDateDesc);

    return res.json({
      total: sortedPinataCertificates.length,
      certificates: sortedPinataCertificates,
      source: "pinata",
      verificationSummary: {
        total: pinataCerts.length,
        trusted: trusted.length,
        warning: warning.length,
        rejected: rejected.length,
        byTrustLevel: {
          trusted,
          warning,
          rejected,
        },
      },
    });
  } catch (error) {
    console.error("Can not get certificates (hybrid): ", error);
    next(error);
  }
};

/**
 * Tìm kiếm metadata chứng chỉ đã pin trên Pinata theo bộ lọc keyvalues.
 * Hỗ trợ phân trang qua limit/offset; trả về danh sách rút gọn kèm CID và URL gateway.
 * @param {import('express').Request} req - query: { student?, issuer?, courseName?, studentName?, limit?, offset? }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const searchCertificates = async (req, res, next) => {
  try {
    const { student, issuer, courseName, studentName, limit, offset } =
      req.query;
    const keyvalues = {};
    if (student)
      keyvalues.student = { value: String(student).toLowerCase(), op: "eq" };
    if (issuer) keyvalues.issuer = { value: String(issuer), op: "eq" };
    if (courseName) {
      const encodedCourseName = encodeURIComponent(String(courseName));
      keyvalues.courseName = { value: encodedCourseName, op: "eq" };
    }
    if (studentName) {
      const encodedStudentName = encodeURIComponent(String(studentName));
      keyvalues.studentName = { value: encodedStudentName, op: "eq" };
    }

    const rows = await searchMetadataByKeyvalues(
      keyvalues,
      Number(limit) || 50,
      Number(offset) || 0
    );
    return res.json({ total: rows.length, list: rows });
  } catch (error) {
    console.error("Can not search certificates: ", error);
    next(error);
  }
};

/**
 * Lấy tất cả chứng chỉ từ database với SIGNATURE VERIFICATION (Admin only)
 *
 * Verify từng certificate và phân loại theo trust level:
 * - TRUSTED: Signature hợp lệ, data đồng bộ
 * - WARNING: Signature hợp lệ nhưng có sync issues
 * - REJECTED: Signature không hợp lệ hoặc bị tampered
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await certificateModel.getAllCertificates();

    // Verify signature cho TẤT CẢ certificates
    const verifiedCertificates = await Promise.all(
      certificates.map(async (cert) => {
        let pinataMetadata = null;
        let verificationResult = null;

        try {
          if (cert.ipfs?.metadataCID) {
            pinataMetadata = await getPinataMetadataByCID(
              cert.ipfs.metadataCID
            );

            verificationResult = verifyCertificateBySignature({
              mongoCert: cert,
              blockchainCert: null,
              pinataMetadata,
            });
          }
        } catch (err) {
          console.error(
            `Failed to verify certificate ${cert.certificateCode}:`,
            err.message
          );
        }

        return {
          ...cert,
          verification: verificationResult
            ? {
                signature: verificationResult.verification.signature,
                trustLevel: verificationResult.trustLevel,
                status: getTrustLevelStatus(verificationResult.trustLevel),
                warnings: verificationResult.warnings,
                errors: verificationResult.errors,
              }
            : {
                signature: { isValid: false, message: "Metadata not found" },
                trustLevel: "unknown",
                status: getTrustLevelStatus("unknown"),
                errors: ["Cannot verify signature - metadata not found"],
              },
        };
      })
    );

    // Phân loại certificates
    const trusted = verifiedCertificates.filter(
      (cert) => cert.verification.trustLevel === "trusted"
    );
    const warning = verifiedCertificates.filter(
      (cert) => cert.verification.trustLevel === "warning"
    );
    const rejected = verifiedCertificates.filter(
      (cert) =>
        cert.verification.trustLevel === "rejected" ||
        cert.verification.trustLevel === "unknown"
    );

    const sortedVerifiedCertificates = verifiedCertificates.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.updatedAt || 0);
      const bDate = new Date(b.createdAt || b.updatedAt || 0);
      return bDate - aDate;
    });

    return res.json({
      total: certificates.length,
      certificates: sortedVerifiedCertificates,
      verificationSummary: {
        total: certificates.length,
        trusted: trusted.length,
        warning: warning.length,
        rejected: rejected.length,
        byTrustLevel: {
          trusted,
          warning,
          rejected,
        },
        healthScore:
          ((trusted.length / certificates.length) * 100).toFixed(2) + "%",
      },
    });
  } catch (error) {
    console.error("Can not get all certificates: ", error);
    return res.status(500).json({
      error: "Failed to get all certificates",
      details: error.message,
    });
  }
};

/**
 * Helper: Convert trust level thành status object với visual indicators
 * @param {string} trustLevel - "trusted" | "warning" | "rejected" | "unknown"
 * @returns {Object} Status object với code, label, color, severity
 */
function getTrustLevelStatus(trustLevel) {
  const statusMap = {
    trusted: {
      code: "VERIFIED",
      label: "Verified & Trusted",
      color: "#22c55e", // green
      severity: "success",
    },
    warning: {
      code: "VERIFIED_WITH_WARNING",
      label: "Verified with warnings",
      color: "#f59e0b", // amber
      severity: "warning",
    },
    rejected: {
      code: "INVALID",
      label: "Invalid Certificate",
      color: "#ef4444", // red
      severity: "error",
    },
    unknown: {
      code: "VERIFICATION_FAILED",
      label: "Cannot Verify",
      color: "#6b7280", // gray
      severity: "error",
    },
  };

  return statusMap[trustLevel] || statusMap.unknown;
}

module.exports = {
  createCertificate,
  issueCertificate,
  getCertificateByHash,
  getCertificateByCode,
  getStudentCertificatesByStudent,
  getStudentCertificatesHybrid,
  searchCertificates,
  getAllCertificates,
};
