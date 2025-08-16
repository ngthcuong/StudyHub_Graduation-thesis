const express = require("express");
const {
  createCertificate,
  getCertificateByHash,
  issueCertificate,
  searchCertificates,
  getStudentCertificatesByStudent,
} = require("../controllers/certificateController");
const router = express.Router();

router.post("/", createCertificate);
router.get("/search", searchCertificates);
router.post("/issue", issueCertificate);
router.get("/student/:address", getStudentCertificatesByStudent);
router.get("/:hash", getCertificateByHash);

module.exports = router;
