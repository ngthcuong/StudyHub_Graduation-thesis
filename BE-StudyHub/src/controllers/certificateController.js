const certificateModel = require("../models/certificateModel");
const { createCertificate } = require("../models/certificateModel");

const certificateController = {
  createCertificate: async (req, res) => {
    try {
      const certificateData = req.body;
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
};

module.exports = certificateController;
