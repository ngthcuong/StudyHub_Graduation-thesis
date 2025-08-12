const certificateModel = require("../models/certificateModel");
const { createCertificate } = require("../models/certificateModel");
const { uploadFileBuffer } = require("../services/ipfs.service");
const {
  issueCertificate: issueOnChain,
  getCertificateByHash: readByHash,
  getStudentCertificatesByStudent: readByStudent,
} = require("../services/ether.service");

const certificateController = {
  createCertificate: async (req, res) => {
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
  },

  issueCertificate: async (req, res, next) => {
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

      const metadata = {
        version: "1.0",
        type: "studyhub-certificate",
        issuer: { name: issuer },
        student: { address: student, name: studentName },
        course: { name: courseName },
        uploadedAt: Date.now(),
        files: fileInfo
          ? { main: `ipfs://${fileInfo.cid}`, mime: req.file.mimetype }
          : undefined,
      };
      const meta = await uploadJSON(metadata);

      const { certHash, txHash } = await issueOnChain(
        student,
        studentName,
        issuer,
        courseName,
        meta.uri
      );

      return res.json({
        ok: true,
        certHash,
        metadataURI: meta.uri,
        metadataCID: meta.cid,
        fileCID: fileInfo?.cid ?? null,
        txHash,
        contract: process.env.CONTRACT_ADDRESS,
      });
    } catch (error) {
      console.error("Can not issue certificate: ", error);
      next(error);
    }
  },

  getCertificateByHash: async (req, res, next) => {
    try {
      const cert = await readByHash(req.params.hash);
      return res.json(cert);
    } catch (error) {
      console.error("Can not find certificate by hash: ", error);
      next(error);
    }
  },

  getStudentCertificatesByStudent: async (req, res, next) => {
    try {
      const [list, total] = await readByStudent(req.params.address);
      return res.json({ total: Number(total), list });
    } catch (error) {
      console.error("Can not get list certificates by student: ", error);
      next(error);
    }
  },
};

module.exports = certificateController;
