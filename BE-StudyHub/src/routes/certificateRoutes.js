const express = require("express");
const {
  createCertificate,
  getCertificateByHash,
  issueCertificate,
  searchCertificates,
} = require("../controllers/certificateController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/certificates", createCertificate);
router.get("/certificates/:hash", getCertificateByHash);
router.put("/certificates/issue", upload.single("file"), issueCertificate);
router.get("/certificates/search", searchCertificates);

module.exports = router;
