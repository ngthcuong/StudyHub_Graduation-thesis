// src/utils/certificateMetadata.js
const buildCertificateMetadata = ({
  version = "1.0",
  issuer,
  studentAddress,
  studentName,
  courseName,
  extra, // optional
}) => {
  return {
    version,
    type: "studyhub-certificate",
    issuer: { name: issuer },
    student: { address: studentAddress, name: studentName },
    course: { name: courseName },
    issuedAt: Date.now(),
    ...extra,
  };
};

module.exports = { buildCertificateMetadata };
