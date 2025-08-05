const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CertificateModule", (m) => {
  const certificateRegistry = m.contract("CertificateRegistry", []);

  return { certificateRegistry };
});
