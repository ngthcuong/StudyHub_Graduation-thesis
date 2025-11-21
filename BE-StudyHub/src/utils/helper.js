const config = require("../configs/config");
const crypto = require("crypto");
const { ethers } = require("ethers");

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
  if (!Array.isArray(certData) || certData.length < 8) {
    return { error: "Invalid certificate data format" };
  }

  const [
    certHash,
    issuerAddress,
    issuerName,
    studentAddress,
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
      name: issuerName,
    },
    course: {
      name: courseName,
    },
    issueDate: {
      timestamp: issuedDate,
      formatted: issueDate.toISOString(),
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

  // Hash -> base36 để rút gọn
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const encoded = parseInt(hash.slice(0, 12), 16).toString(36).toUpperCase();

  // Lấy 6 ký tự
  const codePart = encoded.slice(0, 6);

  return `CERT-${datePart}-${codePart}`;
}

/**
 * Kiểm tra các trường quan trọng của chứng chỉ ở MongoDB, Blockchain, Pinata có giống nhau không
 * @param {Object} mongoCert - Chứng chỉ từ MongoDB
 * @param {Object} blockchainCert - Chứng chỉ từ Blockchain (đã qua structureCertificateData)
 * @param {Object} pinataMetadata - Metadata từ Pinata (JSON)
 * @returns {boolean} - true nếu tất cả trường đều giống nhau, false nếu có trường khác
 */
function isCertificateConsistent(mongoCert, blockchainCert, pinataMetadata) {
  if (!mongoCert || !blockchainCert) return false;

  // Lấy các trường cần so sánh
  const mongoIssuer = mongoCert.issuer?.walletAddress;
  const mongoStudent = mongoCert.student?.walletAddress;
  const mongoCourse = mongoCert.course?.title || mongoCert.course?.name;

  const bcIssuer = blockchainCert.issuer?.address;
  const bcStudent = blockchainCert.student?.address;
  const bcCourse = blockchainCert.course?.name;

  // Pinata có thể thiếu, nên kiểm tra nếu có
  let pinIssuer, pinStudent, pinCourse;
  if (pinataMetadata) {
    pinIssuer = pinataMetadata.issuer?.walletAddress;
    pinStudent = pinataMetadata.student?.walletAddress;
    pinCourse = pinataMetadata.course?.title || pinataMetadata.course?.name;
  }

  // So sánh từng trường
  const issuerMatch =
    mongoIssuer === bcIssuer && (!pinataMetadata || pinIssuer === bcIssuer);

  const studentMatch =
    mongoStudent === bcStudent && (!pinataMetadata || pinStudent === bcStudent);

  const courseMatch =
    mongoCourse === bcCourse && (!pinataMetadata || pinCourse === bcCourse);

  return issuerMatch && studentMatch && courseMatch;
}

/**
 * Xác thực chữ ký điện tử của metadata chứng chỉ
 *
 * 1. Tách signature ra khỏi payload
 * 2. Tạo canonical string từ unsigned payload (sorted keys)
 * 3. So sánh hash
 * 4. Recover signer address từ signature
 * 5. Verify signer khớp với signature.signedBy
 *
 * @param {Object} metadata - Metadata có chứa signature block
 * @returns {Object} { isValid, message?, recoveredAddress?, expectedSigner?, signedHash? }
 */
function verifyMetadataSignature(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return { isValid: false, message: "Metadata is empty" };
  }

  const { signature, ...unsignedPayload } = metadata;

  if (!signature) {
    return { isValid: false, message: "Metadata missing signature block" };
  }

  // Phải tạo canonical string giống hệt lúc sign
  // Sort keys để đảm bảo deterministic (tính toán ra cùng một kết quả)
  const sortedKeys = Object.keys(unsignedPayload).sort();
  const canonicalString = JSON.stringify(unsignedPayload, sortedKeys);
  const expectedHash = ethers.hashMessage(canonicalString);

  // Step 1: Verify hash integrity
  if (signature.signedHash && signature.signedHash !== expectedHash) {
    return {
      isValid: false,
      message: "Signed hash mismatch - payload may have been altered",
      expectedHash,
      providedHash: signature.signedHash,
    };
  }

  // Step 2: Recover signer and verify
  try {
    const recoveredAddress = ethers.verifyMessage(
      canonicalString,
      signature.value
    );
    const isValid =
      recoveredAddress?.toLowerCase() === signature.signedBy?.toLowerCase();
    return {
      isValid,
      message: isValid ? null : "Signer mismatch - signature may be forged",
      recoveredAddress,
      expectedSigner: signature.signedBy,
      signedHash: expectedHash,
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Signature verification failed: ${error.message}`,
    };
  }
}

/**
 * Xác thực chứng chỉ dựa trên chữ ký
 *
 * 1. Ưu tiên xác thực chữ ký từ IPFS metadata
 * 2. Nếu chữ ký hợp lệ -> Certificate TRUSTED (không cần check blockchain/DB)
 * 3. Nếu chữ ký không hợp lệ -> REJECT
 * 4. Cross-source validation chỉ dùng để DETECT sync issues (optional warning)
 *
 * @param {Object} options - { mongoCert, blockchainCert, pinataMetadata }
 * @returns {Object} Verification result với trust level
 */
function verifyCertificateBySignature({
  mongoCert,
  blockchainCert,
  pinataMetadata,
}) {
  const result = {
    trustLevel: "unknown", // unknown | trusted | warning | rejected
    isValid: false,
    verification: {
      signature: null,
      crossSourceConsistency: null,
      sources: {
        database: Boolean(mongoCert),
        blockchain: Boolean(blockchainCert),
        ipfs: Boolean(pinataMetadata),
      },
    },
    warnings: [],
    errors: [],
  };

  // Step 1: Xác thực chữ ký (phải pass)
  if (!pinataMetadata) {
    result.errors.push("IPFS metadata not found - cannot verify signature");
    result.trustLevel = "rejected";
    return result;
  }

  const signatureVerification = verifyMetadataSignature(pinataMetadata);
  result.verification.signature = signatureVerification;

  if (!signatureVerification.isValid) {
    result.errors.push(`Signature invalid: ${signatureVerification.message}`);
    result.trustLevel = "rejected";
    result.isValid = false;
    return result;
  }

  // Step 2: Chữ ký hợp lệ → Certificate TRUSTED
  result.trustLevel = "trusted";
  result.isValid = true;

  // Step 3: Cross-source validation (OPTIONAL - chỉ để detect sync issues)
  if (mongoCert && blockchainCert) {
    const isConsistent = isCertificateConsistent(
      mongoCert,
      blockchainCert,
      pinataMetadata
    );
    result.verification.crossSourceConsistency = {
      isConsistent,
      checkedAt: new Date().toISOString(),
    };

    if (!isConsistent) {
      result.warnings.push(
        "Data inconsistency detected between MongoDB/Blockchain/IPFS - signature is valid but sources are out of sync"
      );
      result.trustLevel = "warning";
    }
  } else {
    result.warnings.push(
      "Cannot perform cross-source validation - some sources unavailable"
    );
  }

  return result;
}

module.exports = {
  toPlain,
  structureCertificateData,
  structureCertificateList,
  generateCertCode,
  isCertificateConsistent,
  verifyMetadataSignature,
  verifyCertificateBySignature,
};
