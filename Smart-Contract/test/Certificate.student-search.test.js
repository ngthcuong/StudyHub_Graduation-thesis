const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { deployCertificateFixture } = require("./fixtures/Certificate.fixture");

describe("CertificateRegistry - Student Search Functions", function () {
  describe("getStudentCertificatesByStudent", function () {
    it("Should return all certificates with correct total count", async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);

      // Issue 3 certificates for student1
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
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 3",
          "ipfs://3"
        );

      // Issue 1 certificate for student2
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Student 2",
          "IUH",
          "Course 4",
          "ipfs://4"
        );

      const [student1Certs, student1Total] =
        await certificateRegistry.getStudentCertificatesByStudent(
          student1.address
        );
      const [student2Certs, student2Total] =
        await certificateRegistry.getStudentCertificatesByStudent(
          student2.address
        );

      // Verify student1 has 3 certificates
      expect(student1Total).to.equal(3);
      expect(student1Certs.length).to.equal(3);
      expect(student1Certs[0].courseName).to.equal("Course 1");
      expect(student1Certs[1].courseName).to.equal("Course 2");
      expect(student1Certs[2].courseName).to.equal("Course 3");

      // Verify student2 has 1 certificate
      expect(student2Total).to.equal(1);
      expect(student2Certs.length).to.equal(1);
      expect(student2Certs[0].courseName).to.equal("Course 4");
    });

    it("Should return empty array for student with no certificates", async function () {
      const { certificateRegistry, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const [certificates, total] =
        await certificateRegistry.getStudentCertificatesByStudent(
          student1.address
        );

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });
  });

  describe("getStudentCertificateByCourseName", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;

      // Setup test data
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Blockchain Development",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Smart Contract Programming",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Web Development",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Mobile Development",
          "ipfs://4"
        );
    });

    it("Should find certificates by exact course name", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseName(
          this.student1.address,
          "Blockchain Development"
        );

      expect(total).to.equal(1);
      expect(certificates.length).to.equal(1);
      expect(certificates[0].courseName).to.equal("Blockchain Development");
    });

    it("Should find certificates by partial course name (case insensitive)", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseName(
          this.student1.address,
          "development"
        );

      expect(total).to.equal(3);
      expect(certificates.length).to.equal(3);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Blockchain Development");
      expect(courseNames).to.include("Web Development");
      expect(courseNames).to.include("Mobile Development");
    });

    it("Should find certificates by uppercase keyword", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseName(
          this.student1.address,
          "SMART"
        );

      expect(total).to.equal(1);
      expect(certificates[0].courseName).to.equal("Smart Contract Programming");
    });

    it("Should return empty array when no matches found", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseName(
          this.student1.address,
          "Python"
        );

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should revert with empty keyword", async function () {
      await expect(
        this.certificateRegistry.getStudentCertificateByCourseName(
          this.student1.address,
          ""
        )
      ).to.be.revertedWith("Keyword cannot be empty");
    });
  });

  describe("getStudentCertificateByDate", function () {
    it("Should find certificates within date range", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const startTime = await time.latest();

      // Issue first certificate
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 1",
          "ipfs://1"
        );

      // Wait 2 seconds in blockchain time
      await time.increase(2);

      // Issue second certificate
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 2",
          "ipfs://2"
        );

      // Wait 2 more seconds
      await time.increase(2);
      const midTime = await time.latest();

      // Issue third certificate
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 3",
          "ipfs://3"
        );

      // End time should be after all certificates
      const endTime = await time.latest();

      // Search for all certificates
      const [allCerts, allTotal] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          startTime,
          endTime
        );

      expect(allTotal).to.equal(3);
      expect(allCerts.length).to.equal(3);

      // Search for certificates in first half (before midTime)
      const [firstHalf, firstTotal] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          startTime,
          midTime
        );

      // Should find at least the first 2 certificates
      expect(firstTotal).to.be.at.least(2);
      expect(firstHalf.length).to.equal(firstTotal);
    });

    it("Should return empty array for date range with no certificates", async function () {
      const { certificateRegistry, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const currentTime = await time.latest();
      const futureDate = currentTime + 86400; // +1 day from current blockchain time

      const [certificates, total] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          futureDate,
          futureDate + 3600
        );

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should handle edge case with exact timestamp match", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const beforeIssue = await time.latest();

      // Issue certificate
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Test Course",
          "ipfs://test"
        );

      const afterIssue = await time.latest();

      // Search with exact timestamp range
      const [certificates, total] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          beforeIssue,
          afterIssue
        );

      expect(total).to.equal(1);
      expect(certificates.length).to.equal(1);
      expect(certificates[0].courseName).to.equal("Test Course");
    });

    it("Should return certificates in chronological order", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const startTime = await time.latest();

      // Issue certificates with time gaps
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "First Course",
          "ipfs://1"
        );

      await time.increase(5);

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Second Course",
          "ipfs://2"
        );

      await time.increase(5);

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Third Course",
          "ipfs://3"
        );

      const endTime = await time.latest();

      const [certificates, total] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          startTime,
          endTime
        );

      expect(total).to.equal(3);
      expect(certificates.length).to.equal(3);

      // Verify chronological order
      expect(certificates[0].courseName).to.equal("First Course");
      expect(certificates[1].courseName).to.equal("Second Course");
      expect(certificates[2].courseName).to.equal("Third Course");

      // Verify timestamps are increasing
      expect(certificates[0].issuedDate).to.be.lessThan(
        certificates[1].issuedDate
      );
      expect(certificates[1].issuedDate).to.be.lessThan(
        certificates[2].issuedDate
      );
    });

    it("Should handle overlapping date ranges correctly", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const startTime = await time.latest();

      // Issue 3 certificates with specific timing
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course A",
          "ipfs://a"
        );

      await time.increase(10);
      const midTime1 = await time.latest();

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course B",
          "ipfs://b"
        );

      await time.increase(10);
      const midTime2 = await time.latest();

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course C",
          "ipfs://c"
        );

      const endTime = await time.latest();

      // Test different overlapping ranges
      const [range1, total1] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          startTime,
          midTime1
        );

      const [range2, total2] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          midTime1,
          midTime2
        );

      const [range3, total3] =
        await certificateRegistry.getStudentCertificateByDate(
          student1.address,
          midTime2,
          endTime
        );

      // Each range should contain at least 1 certificate
      expect(total1).to.be.at.least(1);
      expect(total2).to.be.at.least(1);
      expect(total3).to.be.at.least(1);

      // Total should not exceed 3
      expect(total1).to.be.at.most(3);
      expect(total2).to.be.at.most(3);
      expect(total3).to.be.at.most(3);
    });
  });

  describe("getStudentCertificateByHash", function () {
    it("Should return certificate when student owns it", async function () {
      const { certificateRegistry, admin, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const tx = await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Test Course",
          "ipfs://test"
        );

      const receipt = await tx.wait();
      const certHash = receipt.logs[0].args[0];

      const certificate = await certificateRegistry.getStudentCertificateByHash(
        student1.address,
        certHash
      );

      expect(certificate.student).to.equal(student1.address);
      expect(certificate.courseName).to.equal("Test Course");
    });

    it("Should revert when certificate doesn't belong to student", async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);

      const tx = await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Test Course",
          "ipfs://test"
        );

      const receipt = await tx.wait();
      const certHash = receipt.logs[0].args[0];

      await expect(
        certificateRegistry.getStudentCertificateByHash(
          student2.address,
          certHash
        )
      ).to.be.revertedWith("Certificate does not belong to this student.");
    });

    it("Should revert when certificate doesn't exist", async function () {
      const { certificateRegistry, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake"));

      await expect(
        certificateRegistry.getStudentCertificateByHash(
          student1.address,
          fakeHash
        )
      ).to.be.revertedWith("Certificate not found.");
    });
  });
});
