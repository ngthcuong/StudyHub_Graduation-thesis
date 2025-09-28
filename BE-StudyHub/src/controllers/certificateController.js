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
    const { student, studentName, issuer, issuerName, courseName } = req.body;
    if (!student || !studentName || !issuer || !issuerName || !courseName) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
        required: [
          "student",
          "studentName",
          "issuer",
          "issuerName",
          "courseName",
        ],
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

    const certCode = generateCertCode(
      new Date(),
      req.body.learnerId,
      req.body.courseId
    );

    console.log("Generated certCode:", certCode);

    // Build JSON metadata
    const metadata = buildCertificateMetadata({
      issuer,
      issuerName,
      studentAddress: student,
      studentName,
      courseName,
      certCode,
    });

    console.log("Built metadata:", JSON.stringify(metadata, null, 2));

    // Lưu JSON lên IPFS (Pinata)
    const meta = await uploadJSON(metadata, {
      name: "studyhub-certificate.json",
      keyvalues: {
        type: "studyhub-certificate",
        student: String(student).toLowerCase(),
        studentName: String(studentName),
        issuer: String(issuer).toLowerCase(),
        courseName: String(courseName),
        certCode: String(certCode),
      },
    });

    // Gọi on-chain với metadataURI (ipfs://CID)
    let certHash, txHash;
    try {
      const result = await issueOnChain(
        student,
        studentName,
        issuer,
        courseName,
        meta.uri
      );
      certHash = result.certHash;
      txHash = result.txHash;
    } catch (contractError) {
      throw contractError;
    }
    // Bổ sung certHash, certCode vào keyvalues để search nhanh hơn
    await updatePinataKeyvalues(meta.cid, { certHash: String(certHash) });
    await updatePinataKeyvalues(meta.cid, { certCode: String(certCode) });

    // Tạo và lưu chứng chỉ vào database
    await certificateModel.createCertificate({
      certHash,
      issuer,
      learnerId: req.body.learnerId,
      courseId: req.body.courseId,
      issueDate: new Date(),
      metadataURI: meta.uri,
      metadataCID: meta.cid,
      txHash,
      network: "sepolia",
    });

    return res.json({
      ok: true,
      certHash,
      certCode,
      metadataURI: meta.uri,
      metadataCID: meta.cid,
      txHash,
      contract: config.contractAddress,
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
  searchCertificates,
};
