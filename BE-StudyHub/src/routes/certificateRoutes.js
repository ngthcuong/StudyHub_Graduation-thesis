const express = require("express");
const {
  createCertificate,
  getCertificateByHash,
  issueCertificate,
  searchCertificates,
  getStudentCertificatesByStudent,
} = require("../controllers/certificateController");
const router = express.Router();

router.post("/certificates", createCertificate);
router.get("/certificates/search", searchCertificates);
router.post("/certificates/issue", issueCertificate);
router.get("/certificates/student/:address", getStudentCertificatesByStudent);
router.get("/certificates/:hash", getCertificateByHash);

module.exports = router;
