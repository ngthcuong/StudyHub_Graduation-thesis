const Certificate = require("../schemas/Certificate");

const createCertificate = async (certificateData) => {
  try {
    const newCertificate = new Certificate(certificateData);
    const savedCertificate = await newCertificate.save();
    return savedCertificate;
  } catch (error) {
    console.error("Error creating certificate:", error);
    throw new Error("Failed to create certificate");
  }
};

const findCertificateById = async (id) => {
  try {
    const certificate = await Certificate.findById(id);
    return certificate;
  } catch (error) {
    console.error("Error finding certificate by id:", error);
    throw new Error("Failed to find certificate by id");
  }
};

const findCertificateByCertHash = async (certHash) => {
  try {
    const certificate = await Certificate.findOne({ certHash }).lean();
    return certificate;
  } catch (error) {
    console.error("Error finding certificate by cert hash:", error);
    throw new Error("Failed to find certificate by cert hash");
  }
};

const findCertificateByCertCode = async (certCode) => {
  try {
    const certificate = await Certificate.findOne({ certCode });
    return certificate;
  } catch (error) {
    console.error("Error finding certificate by cert code:", error);
    throw new Error("Failed to find certificate by cert code");
  }
};

const findCertificatesByStudentAddress = async (address) => {
  try {
    const certificates = await Certificate.find({ learnerAddress: address });
    return certificates;
  } catch (error) {
    console.error("Error finding certificate by cert code:", error);
    throw new Error("Failed to find certificate by cert code");
  }
};

const getCertificateByLearnerId = async (learnerId) => {
  try {
    const certificates = await Certificate.find({ learnerId });
    return certificates;
  } catch (error) {
    console.error("Error getting certificates by learner id:", error);
    throw new Error("Failed to get certificates by learner id");
  }
};

module.exports = {
  createCertificate,
  findCertificateById,
  findCertificateByCertHash,
  findCertificateByCertCode,
  findCertificatesByStudentAddress,
  getCertificateByLearnerId,
};
