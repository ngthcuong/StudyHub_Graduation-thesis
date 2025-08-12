import { ethers } from "ethers";
import config from "../configs/config";
import abi from "../configs/CertificateRegistry.abi.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.adminPk, provider);
const contract = new ethers.Contract(config.contractAddress, abi, wallet);

export async function issueCertificate(
  student,
  studentName,
  issuer,
  courseName,
  metadataURI
) {
  const tx = await contract.issueCertificate(
    student,
    studentName,
    issuer,
    courseName,
    metadataURI
  );
  const receipt = await tx.wait();

  const issuedEvent = receipt.logs
    .map((l) => {
      try {
        return contract.interface.parseLog(l);
      } catch {
        return null;
      }
    })
    .find((e) => e && e.name === "CertificateIssued");

  const certHash = issuedEvent?.args?.[0] ?? null;
  return { certHash, txHash: receipt.transactionHash };
}

export function getCertificateByHash(hash) {
  return contract.getCertificateByHash(hash);
}

export function getStudentCertificatesByStudent(address) {
  return contract.getStudentCertificatesByStudent(address);
}
