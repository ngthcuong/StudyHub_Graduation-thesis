const defaultIssuer = {
  walletAddress: "0xB71327c4D0A7916c7874a025C766B4e482008db3",
  name: "StudyHub",
};

const buildCertificateMetadata = ({
  certCode,
  issuer,
  owner,
  course,
  issueDate,
  transactionHash,
  certificateHash,
  network = "Sepolia",
  extra, //optional
}) => {
  return {
    version: "1.0",
    type: "studyhub-certificate",
    certCode: certCode,
    owner: {
      walletAddress: owner.walletAddress,
      name: owner.name,
    },
    course: {
      name: course.name,
      description: course.description,
      duration: course.duration,
    },
    issuer: {
      walletAddress: issuer.walletAddress,
      name: issuer.name,
    },
    validity: {
      issueDate: issueDate || Date.now(),
      expireDate: typeof expireDate !== "undefined" ? expireDate : null,
      isRevoked: typeof isRevoked !== "undefined" ? isRevoked : false,
    },
    blockchain: {
      transactionHash,
      certificateHash,
      network,
    },
    ...extra,
  };
};

module.exports = { buildCertificateMetadata };
