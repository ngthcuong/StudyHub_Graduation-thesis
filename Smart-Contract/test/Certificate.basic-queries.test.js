const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { deployCertificateFixture } = require("./fixtures/Certificate.fixture");

describe("CertificateRegistry - Basic Queries", function () {
  describe("Get Certificate By Hash", function () {
    it("Should return certificate by hash", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const tx = await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Test Student",
          "Test Issuer",
          "Test Course",
          "ipfs://test"
        );

      const receipt = await tx.wait();
      const certHash = receipt.logs[0].args[0];

      const certificate = await certificateRegistry.getCertificateByHash(
        certHash
      );
      expect(certificate.student).to.equal(student1.address);
      expect(certificate.studentName).to.equal("Test Student");
    });

    it("Should revert when getting non-existent certificate", async function () {
      const { certificateRegistry } = await loadFixture(
        deployCertificateFixture
      );

      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake"));

      await expect(
        certificateRegistry.getCertificateByHash(fakeHash)
      ).to.be.revertedWith("Certificate not found");
    });
  });

  describe("Get All Certificates", function () {
    it("Should return empty array when no certificates issued", async function () {
      const { certificateRegistry, admin } = await loadFixture(
        deployCertificateFixture
      );

      // Call function with admin role (required)
      const [certificates, total] = await certificateRegistry
        .connect(admin)
        .getAllCertificates();

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should return all issued certificates with correct total count", async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);

      // Issue 2 certificates
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 1",
          "ipfs://1"
        );

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Student 2",
          "IUH",
          "Course 2",
          "ipfs://2"
        );

      // Call function with admin role
      const [certificates, total] = await certificateRegistry
        .connect(admin)
        .getAllCertificates();

      // Verify total count
      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      // Verify certificate data
      expect(certificates[0].studentName).to.equal("Student 1");
      expect(certificates[0].courseName).to.equal("Course 1");
      expect(certificates[0].student).to.equal(student1.address);

      expect(certificates[1].studentName).to.equal("Student 2");
      expect(certificates[1].courseName).to.equal("Course 2");
      expect(certificates[1].student).to.equal(student2.address);
    });

    it("Should return certificates in correct order (FIFO)", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      // Issue 3 certificates in specific order
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student A",
          "IUH",
          "First Course",
          "ipfs://1"
        );

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student A",
          "IUH",
          "Second Course",
          "ipfs://2"
        );

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student A",
          "IUH",
          "Third Course",
          "ipfs://3"
        );

      const [certificates, total] = await certificateRegistry
        .connect(admin)
        .getAllCertificates();

      expect(total).to.equal(3);
      expect(certificates.length).to.equal(3);

      // Verify order matches issue order
      expect(certificates[0].courseName).to.equal("First Course");
      expect(certificates[1].courseName).to.equal("Second Course");
      expect(certificates[2].courseName).to.equal("Third Course");
    });

    it("Should handle large number of certificates efficiently", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      // Issue 10 certificates
      for (let i = 0; i < 10; i++) {
        await certificateRegistry
          .connect(admin)
          .issueCertificate(
            student1.address,
            `Student ${i}`,
            "IUH",
            `Course ${i}`,
            `ipfs://${i}`
          );
      }

      const [certificates, total] = await certificateRegistry
        .connect(admin)
        .getAllCertificates();

      expect(total).to.equal(10);
      expect(certificates.length).to.equal(10);

      // Verify random certificate in the middle
      expect(certificates[5].studentName).to.equal("Student 5");
      expect(certificates[5].courseName).to.equal("Course 5");
      expect(certificates[5].metadataURI).to.equal("ipfs://5");
    });

    it("Should revert when called by non-admin", async function () {
      const { certificateRegistry, student1 } = await loadFixture(
        deployCertificateFixture
      );

      // Try to call with non-admin account
      await expect(
        certificateRegistry.connect(student1).getAllCertificates()
      ).to.be.revertedWithCustomError(
        certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should return consistent results with total count", async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);

      // Issue some certificates
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 1",
          "ipfs://1"
        );

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Student 2",
          "IUH",
          "Course 2",
          "ipfs://2"
        );

      const [certificates, total] = await certificateRegistry
        .connect(admin)
        .getAllCertificates();

      // Total should always match array length
      expect(total).to.equal(certificates.length);

      // Each certificate should have valid data
      for (let i = 0; i < certificates.length; i++) {
        expect(certificates[i].student).to.not.equal(ethers.ZeroAddress);
        expect(certificates[i].studentName).to.not.equal("");
        expect(certificates[i].courseName).to.not.equal("");
        expect(certificates[i].issuedDate).to.be.greaterThan(0);
        expect(certificates[i].certHash).to.not.equal(ethers.ZeroHash);
      }
    });
  });
});
