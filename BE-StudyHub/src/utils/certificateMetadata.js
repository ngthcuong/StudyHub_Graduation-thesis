const buildCertificateMetadata = ({
  version = "1.0",
  issuer,
  studentAddress,
  studentName,
  courseName,
  fileInfo, // {cid, mine} hoặc undefined
  extra, // object tùy chọn để mở rộng schema
}) => {
  return {
    version,
    type: "studyhub-certificate",
    issuer: { name: issuer },
    student: {
      address: studentAddress,
      name: studentName,
    },
    courseName: {
      name: courseName,
    },
    uploadedAt: Date.now(),
    file: fileInfo
      ? { main: `ipfs://${fileInfo.cid}`, mime: fileInfo.mime }
      : undefined,
    ...extra,
  };
};

module.exports = {
  buildCertificateMetadata,
};
