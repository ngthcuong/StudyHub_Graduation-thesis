// src/utils/certificateMetadata.js
const buildCertificateMetadata = ({
  issuer,
  issuerName,
  studentAddress,
  studentName,
  courseName,
  certCode,
  extra, //optional
}) => {
  return {
    version: "1.0",
    type: "studyhub-certificate",
    issuer: {
      address: issuer,
      name: issuerName,
    },
    student: {
      address: studentAddress,
      name: studentName,
    },
    course: {
      name: courseName,
    },
    certCode: certCode, // thêm certCode
    issuedAt: Date.now(),
    ...extra,
  };
};

module.exports = { buildCertificateMetadata };
