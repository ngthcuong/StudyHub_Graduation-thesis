const { ethers } = require("ethers");
const axios = require("axios");
const config = require("../configs/config");
const abi = require("../configs/CertificateRegistry.abi.json");

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.adminPk, provider);
const contract = new ethers.Contract(config.contractAddress, abi, wallet); //instance contract

/**
 * Gọi smart contract để phát hành chứng chỉ với metadataURI đã lưu trên IPFS.
 * Đợi giao dịch được xác nhận, parse log event CertificateIssued để lấy certHash.
 * @param {string} student Địa chỉ ví người nhận
 * @param {string} studentName Tên người nhận
 * @param {string} issuer Đơn vị/cá nhân phát hành
 * @param {string} courseName Tên khóa học
 * @param {string} metadataURI URI metadata JSON trên IPFS (vd: ipfs://bafy...)
 * @returns {Promise<{ certHash: string|null, txHash: string }>} Mã băm chứng chỉ và hash giao dịch
 */
async function issueCertificate(
  student,
  studentName,
  issuer,
  courseName,
  metadataURI
) {
  // Tạo giao dịch (transaction)
  const tx = await contract.issueCertificate(
    student,
    studentName,
    issuer,
    courseName,
    metadataURI
  );
  const receipt = await tx.wait();

  // Parse logs để tìm event CertificateIssued
  const issuedEvent = receipt.logs
    .map((l) => {
      try {
        return contract.interface.parseLog(l);
      } catch {
        return null;
      }
    })
    .find((e) => e && e.name === "CertificateIssued");

  // Lấy certHash từ arg đầu của event và tả về cùng txHash
  const certHash = issuedEvent?.args?.[0] ?? null;
  return { certHash, txHash: receipt.transactionHash };
}

/**
 * Lấy thông tin chứng chỉ on-chain theo certHash.
 * @param {string} hash Mã băm chứng chỉ (bytes32, dạng 0x...)
 * @returns {Promise<any>} Certificate từ contract
 */
function getCertificateByHash(hash) {
  return contract.getCertificateByHash(hash);
}

/**
 * Lấy danh sách chứng chỉ của sinh viên theo địa chỉ ví.
 * @param {string} address Địa chỉ ví của sinh viên (0x...)
 * @returns {Promise<[any[], bigint]>} Danh sách chứng chỉ và tổng số (uint256)
 */
function getStudentCertificatesByStudent(address) {
  return contract.getStudentCertificatesByStudent(address);
}

module.exports = {
  issueCertificate,
  getCertificateByHash,
  getStudentCertificatesByStudent,
};
