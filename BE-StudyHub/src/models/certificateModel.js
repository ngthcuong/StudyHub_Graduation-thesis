const Certificate = require("../schemas/Certificate");

const certificateModel = {
  createCertificate: async (certificateData) => {
    try {
      const newCertificate = new Certificate(certificateData);
      const savedCertificate = await newCertificate.save();
      return savedCertificate;
    } catch (error) {
      console.error("Error creating certificate:", error);
      throw new Error("Failed to create certificate");
    }
  },
};

module.exports = certificateModel;
