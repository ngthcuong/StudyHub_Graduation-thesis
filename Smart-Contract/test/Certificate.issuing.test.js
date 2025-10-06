const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { deployCertificateFixture } = require("./fixtures/Certificate.fixture");

describe("CertificateRegistry - Issue Certificate", function () {
  describe("Access Control", function () {
    it("Should allow admin to issue certificate", async function () {
      const { certificateRegistry, admin, student1, issuer } =
        await loadFixture(deployCertificateFixture);

      await expect(
        certificateRegistry
          .connect(admin)
          .issueCertificate(
            student1.address,
            "Nguyen Van A",
            issuer.address,
            "IUH University",
            "Blockchain Development",
            "ipfs://test-metadata"
          )
      ).not.to.be.reverted;
    });

    it("Should reject non-admin from issuing certificate", async function () {
      const { certificateRegistry, student1, student2, issuer } =
        await loadFixture(deployCertificateFixture);

      await expect(
        certificateRegistry
          .connect(student1)
          .issueCertificate(
            student2.address,
            "Nguyen Van B",
            issuer.address,
            "IUH University",
            "Smart Contracts",
            "ipfs://test-metadata"
          )
      ).to.be.revertedWithCustomError(
        certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Certificate Creation", function () {
    it("Should create certificate with correct data", async function () {
      const { certificateRegistry, admin, student1, issuer } =
        await loadFixture(deployCertificateFixture);

      const studentName = "Nguyen Van A";
      const issuerName = "IUH University";
      const courseName = "Blockchain Development";
      const metadataURI = "ipfs://test-metadata";

      const tx = await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          studentName,
          issuer.address,
          issuerName,
          courseName,
          metadataURI
        );

      const receipt = await tx.wait();
      const certHash = receipt.logs[0].args[0];

      const certificate = await certificateRegistry.getCertificateByHash(
        certHash
      );

      expect(certificate.student).to.equal(student1.address);
      expect(certificate.studentName).to.equal(studentName);
      expect(certificate.issuer).to.equal(issuer.address);
      expect(certificate.issuerName).to.equal(issuerName);
      expect(certificate.courseName).to.equal(courseName);
      expect(certificate.metadataURI).to.equal(metadataURI);
      expect(certificate.certHash).to.equal(certHash);
      expect(certificate.issuedDate).to.be.greaterThan(0);
    });

    it("Should generate unique hash for each certificate", async function () {
      const { certificateRegistry, admin, student1, student2, issuer } =
        await loadFixture(deployCertificateFixture);

      const tx1 = await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Course 1",
          "ipfs://1"
        );

      const tx2 = await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Student 2",
          issuer.address,
          "IUH",
          "Course 2",
          "ipfs://2"
        );

      const receipt1 = await tx1.wait();
      const receipt2 = await tx2.wait();

      const hash1 = receipt1.logs[0].args[0];
      const hash2 = receipt2.logs[0].args[0];

      expect(hash1).to.not.equal(hash2);
    });
  });

  describe("Events", function () {
    it("Should emit CertificateIssued event", async function () {
      const { certificateRegistry, admin, student1, issuer } =
        await loadFixture(deployCertificateFixture);

      await expect(
        certificateRegistry
          .connect(admin)
          .issueCertificate(
            student1.address,
            "Nguyen Van A",
            issuer.address,
            "IUH University",
            "Blockchain Development",
            "ipfs://test-metadata"
          )
      )
        .to.emit(certificateRegistry, "CertificateIssued")
        .withArgs(anyValue, student1.address);
    });
  });
});
