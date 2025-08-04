const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("CertificateRegistry", function () {
  // Fixture để setup contract trong mỗi test
  async function deployCertificateFixture() {
    // Lấy các signers
    const [owner, admin, student1, student2, issuer] =
      await ethers.getSigners();

    // Deploy contract
    const CertificateRegistry = await ethers.getContractFactory(
      "CertificateRegistry"
    );
    const certificateRegistry = await CertificateRegistry.deploy();

    // Cấp quyền ADMIN cho admin account
    const ADMIN_ROLE = await certificateRegistry.ADMIN_ROLE();
    await certificateRegistry.grantRole(ADMIN_ROLE, admin.address);

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

  describe("Issue Certificate", function () {
    describe("Access Control", function () {
      it("Should allow admin to issue certificate", async function () {
        const { certificateRegistry, admin, student1 } = await loadFixture(
          deployCertificateFixture
        );

        await expect(
          certificateRegistry
            .connect(admin)
            .issueCertificate(
              student1.address,
              "Nguyen Van A",
              "IUH University",
              "Blockchain Development",
              "ipfs://test-metadata"
            )
        ).not.to.be.reverted;
      });

      it("Should reject non-admin from issuing certificate", async function () {
        const { certificateRegistry, student1, student2 } = await loadFixture(
          deployCertificateFixture
        );

        await expect(
          certificateRegistry
            .connect(student1)
            .issueCertificate(
              student2.address,
              "Nguyen Van B",
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
        const { certificateRegistry, admin, student1 } = await loadFixture(
          deployCertificateFixture
        );

        const studentName = "Nguyen Van A";
        const issuer = "IUH University";
        const courseName = "Blockchain Development";
        const metadataURI = "ipfs://test-metadata";

        const tx = await certificateRegistry
          .connect(admin)
          .issueCertificate(
            student1.address,
            studentName,
            issuer,
            courseName,
            metadataURI
          );

        const receipt = await tx.wait();
        const certHash = receipt.logs[0].args[0]; // Lấy hash từ event

        const certificate = await certificateRegistry.getCertificateByHash(
          certHash
        );

        expect(certificate.student).to.equal(student1.address);
        expect(certificate.studentName).to.equal(studentName);
        expect(certificate.issuer).to.equal(issuer);
        expect(certificate.courseName).to.equal(courseName);
        expect(certificate.metadataURI).to.equal(metadataURI);
        expect(certificate.certHash).to.equal(certHash);
        expect(certificate.issuedDate).to.be.greaterThan(0);
      });

      it("Should generate unique hash for each certificate", async function () {
        const { certificateRegistry, admin, student1, student2 } =
          await loadFixture(deployCertificateFixture);

        const tx1 = await certificateRegistry
          .connect(admin)
          .issueCertificate(
            student1.address,
            "Student 1",
            "IUH",
            "Course 1",
            "ipfs://1"
          );

        const tx2 = await certificateRegistry
          .connect(admin)
          .issueCertificate(
            student2.address,
            "Student 2",
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
        const { certificateRegistry, admin, student1 } = await loadFixture(
          deployCertificateFixture
        );

        await expect(
          certificateRegistry
            .connect(admin)
            .issueCertificate(
              student1.address,
              "Nguyen Van A",
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

  describe("Get Certificate", function () {
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
      const { certificateRegistry } = await loadFixture(
        deployCertificateFixture
      );

      const certificates = await certificateRegistry.getAllCertificates();
      expect(certificates.length).to.equal(0);
    });

    it("Should return all issued certificates", async function () {
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

      const certificates = await certificateRegistry.getAllCertificates();
      expect(certificates.length).to.equal(2);
      expect(certificates[0].studentName).to.equal("Student 1");
      expect(certificates[1].studentName).to.equal("Student 2");
    });
  });

  describe("Student Certificates", function () {
    it("Should return certificates for specific student", async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);

      // Issue certificates for student1
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
          student1.address,
          "Student 1",
          "IUH",
          "Course 2",
          "ipfs://2"
        );

      // Issue certificate for student2
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Student 2",
          "IUH",
          "Course 3",
          "ipfs://3"
        );

      const student1Certs = await certificateRegistry.getStudentCertificates(
        student1.address
      );
      const student2Certs = await certificateRegistry.getStudentCertificates(
        student2.address
      );

      expect(student1Certs.length).to.equal(2);
      expect(student2Certs.length).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle empty string parameters", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      await expect(
        certificateRegistry
          .connect(admin)
          .issueCertificate(student1.address, "", "", "", "")
      ).not.to.be.reverted;
    });

    it("Should handle very long string parameters", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const longString = "a".repeat(1000);

      await expect(
        certificateRegistry
          .connect(admin)
          .issueCertificate(
            student1.address,
            longString,
            longString,
            longString,
            longString
          )
      ).not.to.be.reverted;
    });

    it("Should handle zero address as student", async function () {
      const { certificateRegistry, admin } = await loadFixture(
        deployCertificateFixture
      );

      await expect(
        certificateRegistry
          .connect(admin)
          .issueCertificate(
            ethers.ZeroAddress,
            "Test Student",
            "Test Issuer",
            "Test Course",
            "ipfs://test"
          )
      ).not.to.be.reverted;
    });
  });
});
