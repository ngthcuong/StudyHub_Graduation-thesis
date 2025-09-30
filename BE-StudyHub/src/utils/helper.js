const config = require("../configs/config");
const crypto = require("crypto");

// Chuyển dữ liệu từ BigInt -> String
function toPlain(value) {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(toPlain);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = toPlain(v);
    return out;
  }
  return value;
}

/**
 * Cấu trúc lại dữ liệu certificate từ blockchain để dễ đọc
 * @param {Array} certData - Dữ liệu thô từ smart contract
 * @returns {Object} Dữ liệu có cấu trúc
 */
function structureCertificateData(certData) {
  if (!Array.isArray(certData) || certData.length < 7) {
    return { error: "Invalid certificate data format" };
  }

  const [
    certHash,
    studentAddress,
    issuerAddress,
    studentName,
    courseName,
    issuedDate,
    metadataURI,
  ] = toPlain(certData);

  // Chuyển timestamp thành Date object
  const issueDate = new Date(Number(issuedDate) * 1000);

  return {
    certHash,
    student: {
      address: studentAddress,
      name: studentName,
    },
    issuer: {
      address: issuerAddress,
      name: "StudyHub",
    },
    course: {
      name: courseName,
    },
    issueDate: {
      timestamp: issuedDate,
      formatted: issueDate.toISOString(),
      readable: issueDate.toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
    metadata: {
      uri: metadataURI,
      gateway: metadataURI.replace(
        "ipfs://",
        `${config.pinataGatewayBase}/ipfs/`
      ),
    },
    network: "sepolia",
  };
}

/**
 * Cấu trúc lại danh sách certificates
 * @param {Array} certList - Danh sách certificates thô
 * @returns {Array} Danh sách có cấu trúc
 */
function structureCertificateList(certList) {
  if (!Array.isArray(certList)) {
    return [];
  }

  return certList.map((cert) => structureCertificateData(cert));
}

function generateCertCode(issueDate = new Date(), learnerId, courseId) {
  // Format ngày: YYMMDD
  const datePart = issueDate.toISOString().slice(2, 10).replace(/-/g, "");

  // Sinh chuỗi gốc để hash (dựa trên learnerId + courseId + thời gian + random salt)
  const raw = `${learnerId}-${courseId}-${Date.now()}-${Math.random()}`;

  // Hash → base36 để rút gọn
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const encoded = parseInt(hash.slice(0, 12), 16).toString(36).toUpperCase();

  // Lấy 6 ký tự
  const codePart = encoded.slice(0, 6);

  return `CERT-${datePart}-${codePart}`;
}

module.exports = {
  toPlain,
  structureCertificateData,
  structureCertificateList,
  generateCertCode,
};
