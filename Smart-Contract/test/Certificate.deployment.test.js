const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { deployCertificateFixture } = require("./fixtures/Certificate.fixture");

describe("CertificateRegistry - Deployment", function () {
  describe("Deployment", function () {
    it("Should set the deployer as DEFAULT_ADMIN_ROLE", async function () {
      const { certificateRegistry, owner } = await loadFixture(
        deployCertificateFixture
      );

      const DEFAULT_ADMIN_ROLE = await certificateRegistry.DEFAULT_ADMIN_ROLE();
      expect(
        await certificateRegistry.hasRole(DEFAULT_ADMIN_ROLE, owner.address)
      ).to.be.true;
    });

    it("Should set the deployer as ADMIN_ROLE", async function () {
      const { certificateRegistry, owner, ADMIN_ROLE } = await loadFixture(
        deployCertificateFixture
      );

      expect(await certificateRegistry.hasRole(ADMIN_ROLE, owner.address)).to.be
        .true;
    });

    it("Should have correct ADMIN_ROLE hash", async function () {
      const { certificateRegistry } = await loadFixture(
        deployCertificateFixture
      );

      const expectedHash = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      expect(await certificateRegistry.ADMIN_ROLE()).to.equal(expectedHash);
    });
  });
});
