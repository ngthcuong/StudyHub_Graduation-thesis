const { ethers } = require("hardhat");

async function deployCertificateFixture() {
  const [owner, admin, student1, student2, issuer] = await ethers.getSigners();

  const CertificateRegistry = await ethers.getContractFactory(
    "CertificateRegistry"
  );
  const certificateRegistry = await CertificateRegistry.deploy();

  const ADMIN_ROLE = await certificateRegistry.ADMIN_ROLE();
  await certificateRegistry.grantRole(ADMIN_ROLE, admin.address);
  await certificateRegistry.grantRole(ADMIN_ROLE, issuer.address);

  return {
    certificateRegistry,
    owner,
    admin,
    student1,
    student2,
    issuer,
    ADMIN_ROLE,
  };
}

module.exports = {
  deployCertificateFixture,
};
