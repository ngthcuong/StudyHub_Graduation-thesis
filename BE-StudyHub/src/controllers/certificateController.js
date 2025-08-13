const certificateModel = require("../models/certificateModel");
const {
  uploadFileBuffer,
  uploadJSON,
  searchMetadataByKeyvalues,
} = require("../services/ipfs.service");
const {
  issueCertificate: issueOnChain,
  getCertificateByHash: readByHash,
  getStudentCertificatesByStudent: readByStudent,
} = require("../services/ether.service");
const config = require("../configs/config");
const { buildCertificateMetadata } = require("../utils/certificateMetadata");
const { toPlain } = require("../utils/helper");

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

const issueCertificate = async (req, res, next) => {
  try {
    const { student, studentName, issuer, courseName } = req.body;
    if (!student || !studentName || !issuer || !courseName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let fileInfo = null;
    if (req.file) {
      fileInfo = await uploadFileBuffer(
        req.file.originalname,
        req.file.buffer,
        req.file.mimetype
      );
    }

    // Build JSON metadata
    const metadata = buildCertificateMetadata({
      issuer,
      studentAddress: student,
      studentName,
      courseName,
      fileInfo: fileInfo && { cid: fileInfo.cid, mime: req.file.mimetype },
    });

    // Lưu JSON lên IPFS (Pinata)
    const meta = await uploadJSON(metadata, {
      name: "studyhub-certificate.json",
      keyvalues: {
        type: "studyhub-certificate",
        student: student.toLowerCase(),
        studentName,
        issuer,
        courseName,
      },
    });

    // Gọi on-chain với metadataURI (ipfs://CID)
    const { certHash, txHash } = await issueOnChain(
      student,
      studentName,
      issuer,
      courseName,
      meta.uri
    );

    await certificateModel.createCertificate({
      certHash,
      issuer,
      learnerId: req.body.learnerId,
      courseId: req.body.courseId,
      issueDate: new Date(),
      metadataURI: meta.uri,
      metadataCID: meta.cid,
      fileCID: fileInfo?.cid ?? null,
      txHash,
      network: "sepolia",
    });

    return res.json({
      ok: true,
      certHash,
      metadataURI: meta.uri,
      metadataCID: meta.cid,
      fileCID: fileInfo?.cid ?? null,
      txHash,
      contract: config.contractAddress,
    });
  } catch (error) {
    console.error("Can not issue certificate: ", error);
    next(error);
  }
};

const getCertificateByHash = async (req, res, next) => {
  try {
    const cert = await readByHash(req.params.hash);
    return res.json(toPlain(cert));
  } catch (error) {
    console.error("Can not find certificate by hash: ", error);
    next(error);
  }
};

const getStudentCertificatesByStudent = async (req, res, next) => {
  try {
    const [list, total] = await readByStudent(req.params.address);
    return res.json({ total: Number(total), list });
  } catch (error) {
    console.error("Can not get list certificates by student: ", error);
    next(error);
  }
};

const searchCertificates = async (req, res, next) => {
  try {
    const { student, issuer, courseName, studentName, limit, offset } =
      req.query;
    const keyvalues = {};
    if (student)
      keyvalues.student = { value: String(student).toLowerCase(), op: "eq" };
    if (issuer) keyvalues.issuer = { value: String(issuer), op: "eq" };
    if (courseName)
      keyvalues.courseName = { value: String(courseName), op: "eq" };
    if (studentName)
      keyvalues.studentName = { value: String(studentName), op: "eq" };

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
  getStudentCertificatesByStudent,
  searchCertificates,
};
