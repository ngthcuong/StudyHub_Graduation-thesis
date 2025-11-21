/**
 * Signature Verification Utilities
 *
 * Tách riêng logic xác thực chữ ký để dễ test và maintain
 */

const { ethers } = require("ethers");

/**
 * Tạo canonical string (chuỗi chuẩn hóa) từ object (sorted keys)
 *
 * @param {Object} obj - Object cần serialize (tuần tự)
 * @returns {string} Canonical JSON string
 */
function toCanonicalJSON(obj) {
  const sortedKeys = Object.keys(obj).sort();
  return JSON.stringify(obj, sortedKeys);
}

/**
 * Verify single signature
 *
 * @param {Object} metadata - Metadata có signature
 * @returns {Object} Verification result
 */
function verifySignature(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return {
      isValid: false,
      reason: "Metadata is empty or invalid",
    };
  }

  const { signature, ...unsignedPayload } = metadata;

  if (!signature || !signature.value || !signature.signedBy) {
    return {
      isValid: false,
      reason: "Missing signature fields",
    };
  }

  try {
    // Create canonical string
    const canonicalString = toCanonicalJSON(unsignedPayload);
    const expectedHash = ethers.hashMessage(canonicalString);

    // Verify hash if provided
    if (signature.signedHash && signature.signedHash !== expectedHash) {
      return {
        isValid: false,
        reason: "Hash mismatch - payload altered",
        expectedHash,
        providedHash: signature.signedHash,
      };
    }

    // Recover signer
    const recoveredAddress = ethers.verifyMessage(
      canonicalString,
      signature.value
    );

    const isValid =
      recoveredAddress.toLowerCase() === signature.signedBy.toLowerCase();

    return {
      isValid,
      reason: isValid ? null : "Signer mismatch",
      recoveredAddress,
      expectedSigner: signature.signedBy,
      signedHash: expectedHash,
    };
  } catch (error) {
    return {
      isValid: false,
      reason: `Verification error: ${error.message}`,
    };
  }
}

/**
 * Verify batch signatures
 *
 * @param {Array<Object>} metadataList - Array of metadata objects
 * @returns {Object} Summary of verification results
 */
function verifyBatchSignatures(metadataList) {
  const results = metadataList.map((metadata, index) => ({
    index,
    ...verifySignature(metadata),
  }));

  const valid = results.filter((r) => r.isValid).length;
  const invalid = results.length - valid;

  return {
    total: results.length,
    valid,
    invalid,
    results,
  };
}

/**
 * Check if signer is trusted (matches expected issuer address)
 *
 * @param {Object} signature - Signature object
 * @param {string} trustedIssuerAddress - Expected issuer address
 * @returns {boolean}
 */
function isTrustedSigner(signature, trustedIssuerAddress) {
  if (!signature || !signature.signedBy || !trustedIssuerAddress) {
    return false;
  }
  return (
    signature.signedBy.toLowerCase() === trustedIssuerAddress.toLowerCase()
  );
}

module.exports = {
  toCanonicalJSON,
  verifySignature,
  verifyBatchSignatures,
  isTrustedSigner,
};
