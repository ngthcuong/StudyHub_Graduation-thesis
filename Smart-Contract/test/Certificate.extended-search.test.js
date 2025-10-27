const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { deployCertificateFixture } = require("./fixtures/Certificate.fixture");

describe("CertificateRegistry - Extended Search Functions", function () {
  describe("Student Search by Course Type", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1, issuer } =
        await loadFixture(deployCertificateFixture);
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;
      this.issuer = issuer;

      // Setup test data with various course types
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Blockchain Fundamentals",
          "Technology",
          "Beginner",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Business Management",
          "Business",
          "Intermediate",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Web Development",
          "Technology",
          "Advanced",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Marketing Strategy",
          "Business",
          "Intermediate",
          "ipfs://4"
        );
    });

    it("Should find certificates by course type (Technology)", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseType(
          this.student1.address,
          "Technology"
        );

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Blockchain Fundamentals");
      expect(courseNames).to.include("Web Development");

      // Verify all certificates are Technology type
      certificates.forEach((cert) => {
        expect(cert.courseType).to.equal("Technology");
      });
    });

    it("Should find certificates by course type (Business)", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseType(
          this.student1.address,
          "Business"
        );

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Business Management");
      expect(courseNames).to.include("Marketing Strategy");

      // Verify all certificates are Business type
      certificates.forEach((cert) => {
        expect(cert.courseType).to.equal("Business");
      });
    });

    it("Should be case insensitive", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseType(
          this.student1.address,
          "technology"
        );

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);
    });

    it("Should return empty array when no matches found", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseType(
          this.student1.address,
          "Science"
        );

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should revert with empty keyword", async function () {
      await expect(
        this.certificateRegistry.getStudentCertificateByCourseType(
          this.student1.address,
          ""
        )
      ).to.be.revertedWith("Keyword cannot be empty");
    });
  });

  describe("Student Search by Course Level", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1, issuer } =
        await loadFixture(deployCertificateFixture);
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;
      this.issuer = issuer;

      // Setup test data with various course levels
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Basic Programming",
          "Technology",
          "Beginner",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Web Development",
          "Technology",
          "Intermediate",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "Smart Contracts",
          "Technology",
          "Advanced",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Student 1",
          issuer.address,
          "IUH",
          "React Basics",
          "Technology",
          "Beginner",
          "ipfs://4"
        );
    });

    it("Should find certificates by course level (Beginner)", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseLevel(
          this.student1.address,
          "Beginner"
        );

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Basic Programming");
      expect(courseNames).to.include("React Basics");

      // Verify all certificates are Beginner level
      certificates.forEach((cert) => {
        expect(cert.courseLevel).to.equal("Beginner");
      });
    });

    it("Should find certificates by course level (Advanced)", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseLevel(
          this.student1.address,
          "Advanced"
        );

      expect(total).to.equal(1);
      expect(certificates.length).to.equal(1);
      expect(certificates[0].courseName).to.equal("Smart Contracts");
      expect(certificates[0].courseLevel).to.equal("Advanced");
    });

    it("Should be case insensitive", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseLevel(
          this.student1.address,
          "intermediate"
        );

      expect(total).to.equal(1);
      expect(certificates[0].courseName).to.equal("Web Development");
    });

    it("Should return empty array when no matches found", async function () {
      const [certificates, total] =
        await this.certificateRegistry.getStudentCertificateByCourseLevel(
          this.student1.address,
          "Expert"
        );

      expect(total).to.equal(0);
      expect(certificates.length).to.equal(0);
    });

    it("Should revert with empty keyword", async function () {
      await expect(
        this.certificateRegistry.getStudentCertificateByCourseLevel(
          this.student1.address,
          ""
        )
      ).to.be.revertedWith("Keyword cannot be empty");
    });
  });

  describe("Admin Search by Course Type", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1, student2, issuer } =
        await loadFixture(deployCertificateFixture);
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;
      this.student2 = student2;
      this.issuer = issuer;

      // Setup test data with various course types across multiple students
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          issuer.address,
          "IUH",
          "Machine Learning",
          "Technology",
          "Advanced",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Bob",
          issuer.address,
          "IUH",
          "Financial Analysis",
          "Business",
          "Intermediate",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          issuer.address,
          "IUH",
          "Cybersecurity",
          "Technology",
          "Advanced",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Bob",
          issuer.address,
          "IUH",
          "Leadership",
          "Business",
          "Intermediate",
          "ipfs://4"
        );
    });

    it("Should find all Technology certificates across all students", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourseType("Technology");

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Machine Learning");
      expect(courseNames).to.include("Cybersecurity");

      // Verify all certificates are Technology type
      certificates.forEach((cert) => {
        expect(cert.courseType).to.equal("Technology");
      });
    });

    it("Should find all Business certificates across all students", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourseType("Business");

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Financial Analysis");
      expect(courseNames).to.include("Leadership");

      // Verify all certificates are Business type
      certificates.forEach((cert) => {
        expect(cert.courseType).to.equal("Business");
      });
    });

    it("Should be case insensitive", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourseType("TECHNOLOGY");

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);
    });

    it("Should revert when called by non-admin", async function () {
      await expect(
        this.certificateRegistry
          .connect(this.student1)
          .adminSearchByCourseType("Technology")
      ).to.be.revertedWithCustomError(
        this.certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Admin Search by Course Level", function () {
    beforeEach(async function () {
      const { certificateRegistry, admin, student1, student2, issuer } =
        await loadFixture(deployCertificateFixture);
      this.certificateRegistry = certificateRegistry;
      this.admin = admin;
      this.student1 = student1;
      this.student2 = student2;
      this.issuer = issuer;

      // Setup test data with various course levels across multiple students
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          issuer.address,
          "IUH",
          "Programming Basics",
          "Technology",
          "Beginner",
          "ipfs://1"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Bob",
          issuer.address,
          "IUH",
          "Database Design",
          "Technology",
          "Intermediate",
          "ipfs://2"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student1.address,
          "Alice",
          issuer.address,
          "IUH",
          "AI Research",
          "Technology",
          "Advanced",
          "ipfs://3"
        );
      await certificateRegistry
        .connect(admin)
        .issueCertificate(
          student2.address,
          "Bob",
          issuer.address,
          "IUH",
          "Web Fundamentals",
          "Technology",
          "Beginner",
          "ipfs://4"
        );
    });

    it("Should find all Beginner level certificates", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourseLevel("Beginner");

      expect(total).to.equal(2);
      expect(certificates.length).to.equal(2);

      const courseNames = certificates.map((cert) => cert.courseName);
      expect(courseNames).to.include("Programming Basics");
      expect(courseNames).to.include("Web Fundamentals");

      // Verify all certificates are Beginner level
      certificates.forEach((cert) => {
        expect(cert.courseLevel).to.equal("Beginner");
      });
    });

    it("Should find Advanced level certificates", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourseLevel("Advanced");

      expect(total).to.equal(1);
      expect(certificates.length).to.equal(1);
      expect(certificates[0].courseName).to.equal("AI Research");
      expect(certificates[0].courseLevel).to.equal("Advanced");
    });

    it("Should be case insensitive", async function () {
      const [certificates, total] = await this.certificateRegistry
        .connect(this.admin)
        .adminSearchByCourseLevel("INTERMEDIATE");

      expect(total).to.equal(1);
      expect(certificates[0].courseName).to.equal("Database Design");
    });

    it("Should revert when called by non-admin", async function () {
      await expect(
        this.certificateRegistry
          .connect(this.student1)
          .adminSearchByCourseLevel("Advanced")
      ).to.be.revertedWithCustomError(
        this.certificateRegistry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });
});
