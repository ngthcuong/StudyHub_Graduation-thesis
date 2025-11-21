/**
 * Build certificate metadata với format chuẩn hóa
 *
 *  Normalize tất cả dữ liệu để đảm bảo canonical form
 * - Date -> ISO string
 * - Address -> lowercase
 * - ObjectId -> string
 * - Boolean -> explicit true/false
 */
const buildCertificateMetadata = ({
  certCode,
  issuer,
  student,
  course,
  issueDate,
  expireDate = null,
  isRevoked = false,
  network = "Sepolia",
  extra, //optional
}) => {
  // Normalize issueDate to ISO string
  const normalizedIssueDate =
    issueDate instanceof Date
      ? issueDate.toISOString()
      : new Date(issueDate).toISOString();

  // Normalize expireDate if provided
  const normalizedExpireDate = expireDate
    ? expireDate instanceof Date
      ? expireDate.toISOString()
      : new Date(expireDate).toISOString()
    : null;

  const metadata = {
    version: "1.0",
    type: "studyhub-certificate",
    certCode: String(certCode),
    student: {
      id: String(student._id),
      walletAddress: String(student.walletAddress).toLowerCase(),
      name: String(student.fullName),
    },
    course: {
      id: String(course._id),
      title: String(course.title),
      type: course?.courseType || null,
      level: course?.courseLevel || null,
    },
    issuer: {
      walletAddress: String(issuer.walletAddress).toLowerCase(),
      name: String(issuer.name),
    },
    validity: {
      issueDate: normalizedIssueDate,
      expireDate: normalizedExpireDate,
      isRevoked: Boolean(isRevoked),
    },
    blockchain: {
      network: String(network),
    },
  };

  // Merge extra fields if provided
  if (extra && typeof extra === "object") {
    Object.assign(metadata, extra);
  }

  return metadata;
};

module.exports = { buildCertificateMetadata };
