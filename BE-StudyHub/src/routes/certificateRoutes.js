const express = require("express");
const {
  createCertificate,
  getCertificateByHash,
  issueCertificate,
  searchCertificates,
  getStudentCertificatesByStudent,
  getCertificateByCode,
} = require("../controllers/certificateController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", verifyToken, createCertificate);
router.get("/search", verifyToken, searchCertificates);
router.post("/issue", verifyToken, issueCertificate);
router.get("/student/:address", verifyToken, getStudentCertificatesByStudent);
router.get("/hash/:hash", getCertificateByHash);
router.get("/code/:code", getCertificateByCode);

module.exports = router;
