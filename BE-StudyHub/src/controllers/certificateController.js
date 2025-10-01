const certificateModel = require("../models/certificateModel");
const {
  uploadJSON,
  searchMetadataByKeyvalues,
  updatePinataKeyvalues,
} = require("../services/ipfs.service");
const {
  issueCertificate: issueOnChain,
  getCertificateByHash: readByHash,
  getStudentCertificatesByStudent: readByStudent,
} = require("../services/ethers.service");
const config = require("../configs/config");
const { buildCertificateMetadata } = require("../utils/certificateMetadata");
const {
  toPlain,
  structureCertificateData,
  structureCertificateList,
  generateCertCode,
} = require("../utils/helper");
const Certificate = require("../schemas/Certificate");
const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");

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
 * @param {import('express').Request} req - JSON body: { student, studentName, issuer, courseName, learnerId?, courseId? }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const issueCertificate = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
        required: ["studentId", "courseId"],
      });
    }

    // let fileInfo = null;
    // if (req.file) {
    //   fileInfo = await uploadFileBuffer(
    //     req.file.originalname,
    //     req.file.buffer,
    //     req.file.mimetype
    //   );
    // }

    const certCode = generateCertCode(new Date(), studentId, courseId);

    const [student, course] = await Promise.all([
      userModel.findUserById(studentId),
      courseModel.findCourseById(courseId),
    ]);

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
        studentId,
      });
    }

    if (!student.walletAddress) {
      return res.status(404).json({
        error: "Student have not wallet address",
        studentId,
      });
    }

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
        courseId,
      });
    }

    const defaultIssuer = {
      walletAddress: config.contractAddress,
      name: "StudyHub",
    };

    console.log(course);
    console.log(student);

    // Build JSON metadata
    const metadata = buildCertificateMetadata({
      certCode,
      student,
      issuer: defaultIssuer,
      course,
      issueDate: new Date(),
    });

    console.log(metadata);

    // Lưu JSON lên IPFS (Pinata)
    const meta = await uploadJSON(metadata, {
      name: "studyhub-certificate.json",
      keyvalues: {
        type: "studyhub-certificate",
        studentWalletAddress: String(student.walletAddress),
        issuerWalletAddress: String(defaultIssuer.walletAddress),
        certificateCode: String(certCode),
      },
    });

    // Gọi on-chain với metadataURI (ipfs://CID) - Lưu chứng chỉ lên blockchain
    let certHash, txHash;
    try {
      const result = await issueOnChain(
        student.walletAddress,
        student.fullName,
        defaultIssuer.walletAddress,
        course.title,
        meta.uri
      );
      certHash = result.certHash;
      txHash = result.txHash;
    } catch (contractError) {
      console.error(
        "Blockchain failed, metadata uploaded but unused:",
        meta.cid
      );
      throw contractError;
    }

    // Cập nhật keyvalues trên Pinata với thông tin blockchain
    await updatePinataKeyvalues(meta.cid, {
      certificateHash: String(certHash),
      studentWalletAddress: String(student.walletAddress),
      issuerWalletAddress: String(defaultIssuer.walletAddress),
      network: "Sepolia",
    });

    // Tạo và lưu chứng chỉ vào database
    const savedCertificate = await Certificate.create({
      certificateCode: certCode,
      student: {
        id: studentId,
        name: student.fullName,
        walletAddress: student.walletAddress,
      },
      course: {
        id: courseId,
        title: course.title,
        description: course.description || "",
        durationHours: course.durationHours || "",
      },
      issuer: {
        walletAddress: defaultIssuer.walletAddress,
        name: defaultIssuer.name,
      },
      validity: {
        issueDate: new Date(),
        expireDate: null,
        isRevoked: false,
      },
      blockchain: {
        transactionHash: txHash,
        certificateHash: certHash,
        network: "Sepolia",
      },
      ipfs: {
        metadataURI: meta.uri,
        metadataCID: meta.cid,
        fileCID: "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: {
        certificateId: savedCertificate._id,
        certCode,
        certHash,
        txHash,
        metadataURI: meta.uri,
        metadataCID: meta.cid,
        network: "Sepolia",
        issuer: defaultIssuer,
        student: {
          id: studentId,
          name: student.fullName,
          walletAddress: student.walletAddress,
        },
        course: {
          id: courseId,
          name: course.title,
        },
        issueDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Can not issue certificate: ", error);
    next(error);
  }
};

/**
 * Lấy thông tin chứng chỉ on-chain theo certHash.
 * Ghi chú: dữ liệu có kiểu BigInt (vd issuedDate) sẽ được chuyển sang string bằng toPlain.
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
    const cert = await readByHash(hash);

    // Cấu trúc lại dữ liệu để dễ đọc
    const structuredCert = structureCertificateData(cert);

    return res.json({
      certificate: structuredCert,
      raw: toPlain(cert), // Giữ lại dữ liệu gốc nếu cần
    });
  } catch (error) {
    console.error("Can not find certificate by hash: ", error);
    next(error);
  }
};

/**
 * Lấy thông tin chứng chỉ on-chain theo certCode.
 * Ghi chú: dữ liệu có kiểu BigInt (vd issuedDate) sẽ được chuyển sang string bằng toPlain.
 * @param {import('express').Request} req - params: { certCode }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getCertificateByCode = async (req, res, next) => {
  try {
    const certCode = req.params.code;
    if (!certCode) {
      return res.status(400).json({ error: "Missing certificate code" });
    }

    // Tìm chứng chỉ trong DB
    const certificate = await certificateModel.findCertificateByCertCode(
      certCode
    );

    if (
      !certificate.certHash ||
      certificate.certHash.length !== 66 ||
      !certificate.certHash.startsWith("0x")
    ) {
      return res.status(400).json({ error: "Invalid certificate hash format" });
    }

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // Lấy thông tin chứng chỉ từ blockchain
    const cert = await readByHash(certificate.certHash);
    const structuredCert = structureCertificateData(cert);

    return res.json({
      certificate: structuredCert,
      metadata: certificate,
      raw: toPlain(cert),
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

    console.log(structuredList);

    return res.json({
      total: Number(total),
      certificates: structuredList,
    });
  } catch (error) {
    console.error("Can not get list certificates by student: ", error);
    next(error);
  }
};

/**
 * Lấy danh sách chứng chỉ kết hợp database và blockchain
 * @param {import('express').Request} req - params: { address }
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getStudentCertificatesHybrid = async (req, res, next) => {
  try {
    const { address } = req.params;

    // 1. Lấy từ database trước
    try {
      const dbCertificates =
        await certificateModel.findCertificatesByStudentAddress(address);

      if (dbCertificates && dbCertificates.length > 0) {
        return res.json({
          total: dbCertificates.length,
          certificates: dbCertificates,
          source: "database",
        });
      }
    } catch (dbError) {
      console.error("Database query failed:", dbError.message);
    }

    // 2. Fallback: Lấy từ Pinata
    const keyvalues = {
      learnerAddress: { value: String(address), op: "eq" },
    };

    // Lấy tất cả chứng chỉ trước (không lọc)
    const pinataCerts = await searchMetadataByKeyvalues(keyvalues, 100, 0);

    const formatPinataCertificates = pinataCerts.map((cert) => {
      const keyvalues = cert.metadata?.keyvalues || {};

      // Format lại theo cấu trúc database
      return {
        _id: cert.cid, // Sử dụng CID làm ID tạm thời
        certHash: keyvalues.certHash || null,
        issuer: keyvalues.issuer || null,
        learnerId: keyvalues.learnerId || null,
        learnerAddress: keyvalues.learnerAddress || keyvalues.student || null,
        courseId: keyvalues.courseId || null,
        courseName: keyvalues.courseName || null,
        issueDate: keyvalues.issueDate || cert.date_pinned,
        metadataURI: cert.uri,
        metadataCID: cert.cid,
        network: keyvalues.network || "sepolia",
        createdAt: cert.date_pinned,
        updatedAt: cert.date_pinned,
        certCode: keyvalues.certCode || null,
      };
    });

    return res.json({
      total: pinataCerts.length,
      certificates: formatPinataCertificates,
      source: "pinata",
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

module.exports = {
  createCertificate,
  issueCertificate,
  getCertificateByHash,
  getCertificateByCode,
  getStudentCertificatesByStudent,
  getStudentCertificatesHybrid,
  searchCertificates,
};
