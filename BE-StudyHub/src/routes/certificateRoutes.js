const express = require("express");
const { createCertificate } = require("../controllers/certificateController");
const router = express.Router();

router.post("/certificates", createCertificate);

module.exports = router;
