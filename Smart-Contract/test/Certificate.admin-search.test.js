const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { deployCertificateFixture } = require("./fixtures/Certificate.fixture");

describe("CertificateRegistry - Admin Search Functions", function () {
  describe("adminSearchByCourse", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;
      this.student2 = student2;

      // Setup test data with various courses
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          "IUH",
          "Blockchain Development",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Bob",
          "IUH",
          "Smart Contract Programming",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          "IUH",
          "Web Development",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Bob",
          "IUH",
          "Mobile App Development",
          "ipfs://4"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          "IUH",
          "Data Science",
          "ipfs://5"
        );
    });

    it("Should find all certificates matching course keyword", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourse("development");

      expect(total).to.equal(3);
      expect(certificates.length).to.equal(3);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Blockchain Development");
      expect(courseNames).to.include("Web Development");
      expect(courseNames).to.include("Mobile App Development");
    });

    it("Should be case insensitive", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourse("SMART");

      expect(total).to.equal(1);
      expect(certificates[0].courseName).to.equal("Smart Contract Programming");
    });

    it("Should return all certificates when searching common keyword", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourse("Data");

      expect(total).to.equal(1);
      expect(certificates[0].courseName).to.equal("Data Science");
    });

    it("Should return empty array when no matches found", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourse("Python");

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should revert with empty keyword", async function () {
      await expect(
        this.certificateRegistry.connect(this.admin).adminSearchByCourse("")
      ).to.be.revertedWith("Keyword cannot be empty");
    });

    it("Should revert when called by non-admin", async function () {
      await expect(
        this.certificateRegistry
          .connect(this.student1)
          .adminSearchByCourse("Blockchain")
      ).to.be.revertedWithCustomError(
        this.certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("adminSearchByStudentName", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;
      this.student2 = student2;

      // Setup test data with various student names
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Nguyen Van An",
          "IUH",
          "Course 1",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Tran Thi Binh",
          "IUH",
          "Course 2",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Nguyen Van An",
          "IUH",
          "Course 3",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Le Van Cuong",
          "IUH",
          "Course 4",
          "ipfs://4"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Nguyen Thi Dung",
          "IUH",
          "Course 5",
          "ipfs://5"
        );
    });

    it("Should find all certificates for student with exact name", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByStudentName("Nguyen Van An");

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);
      expect(certificates[0].studentName).to.equal("Nguyen Van An");
      expect(certificates[1].studentName).to.equal("Nguyen Van An");
    });

    it("Should find certificates by partial name (case insensitive)", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByStudentName("nguyen");

      expect(total).to.equal(3);
      expect(certificates.length).to.equal(3);

      const studentNames = certificates.map((cert) => cert.studentName);
      expect(
        studentNames.filter((name) => name.includes("Nguyen")).length
      ).to.equal(3);
    });

    it("Should find certificates by first name", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByStudentName("Van");

      expect(total).to.equal(3);
      expect(certificates.length).to.equal(3);
    });

    it("Should return empty array when no matches found", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByStudentName("Hoang");

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should revert with empty keyword", async function () {
      await expect(
        this.certificateRegistry
          .connect(this.admin)
          .adminSearchByStudentName("")
      ).to.be.revertedWith("Keyword cannot be empty");
    });

    it("Should revert when called by non-admin", async function () {
      await expect(
        this.certificateRegistry
          .connect(this.student1)
          .adminSearchByStudentName("Nguyen")
      ).to.be.revertedWithCustomError(
        this.certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("adminSearchByDate", function () {
    it("Should find certificates within date range", async function () {
      const { certificateRegistry, admin, student1, student2 } =
        await loadFixture(deployCertificateFixture);

      // Get blockchain time
      const startTime = await time.latest();

      // Issue certificates at different times
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 1",
          "ipfs://1"
        );

      await time.increase(2);
      const midTime = await time.latest();

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Student 2",
          "IUH",
          "Course 2",
          "ipfs://2"
        );

      await time.increase(2);

      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          "IUH",
          "Course 3",
          "ipfs://3"
        );

      const endTime = await time.latest();

      // Search for all certificates
      const [allCerts, allTotal] = await certificateRegistry
        .connect(admin)
        .adminSearchByDate(startTime, endTime);

      expect(allTotal).to.equal(3);
      expect(allCerts.length).to.equal(3);

      // Search for certificates in first half
      const [firstHalf, firstTotal] = await certificateRegistry
        .connect(admin)
        .adminSearchByDate(startTime, midTime);

      expect(firstTotal).to.be.at.least(1);
      expect(firstHalf.length).to.equal(firstTotal);
    });

    it("Should return empty array for future date range", async function () {
      const { certificateRegistry, admin } = await loadFixture(
        deployCertificateFixture
      );

      const futureStart = Math.floor(Date.now() / 1000) + 86400; // +1 day
      const futureEnd = futureStart + 3600; // +1 hour

      const [certificates, total] = await certificateRegistry
        .connect(admin)
        .adminSearchByDate(futureStart, futureEnd);

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should revert when called by non-admin", async function () {
      const { certificateRegistry, student1 } = await loadFixture(
        deployCertificateFixture
      );

      const now = Math.floor(Date.now() / 1000);
      await expect(
        certificateRegistry.connect(student1).adminSearchByDate(now, now + 3600)
      ).to.be.revertedWithCustomError(
        certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });
});
