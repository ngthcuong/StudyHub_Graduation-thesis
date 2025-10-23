const { ethers } = require("hardhat");

async function main() {
  console.log("=== Certificate Registry Deployment Test ===\n");

  // Get signers
  const [deployer, admin, student1, student2, issuer] =
    await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH\n"
  );

  // Deploy contract
  const CertificateRegistry = await ethers.getContractFactory(
    "CertificateRegistry"
  );
  const certificateRegistry = await CertificateRegistry.deploy();
  await certificateRegistry.waitForDeployment();

  const contractAddress = await certificateRegistry.getAddress();
  console.log("CertificateRegistry deployed to:", contractAddress);

  // Setup roles
  const ADMIN_ROLE = await certificateRegistry.ADMIN_ROLE();
  await certificateRegistry.grantRole(ADMIN_ROLE, admin.address);
  await certificateRegistry.grantRole(ADMIN_ROLE, issuer.address);

  console.log("Admin role granted to:", admin.address);
  console.log("Admin role granted to:", issuer.address);

  console.log("\n=== Testing New Certificate Structure ===\n");

  // Test issuing certificate with new structure
  console.log("Issuing certificate with new structure...");
  const tx = await certificateRegistry
    .connect(admin)
    .issueCertificate(
      student1.address,
      "Nguyen Van A",
      issuer.address,
      "Industrial University of Ho Chi Minh City",
      "Blockchain Development Fundamentals",
      "Technology",
      "Advanced",
      "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
    );

  const receipt = await tx.wait();
  const certHash = receipt.logs[0].args[0];

  console.log("✓ Certificate issued successfully!");
  console.log("Certificate Hash:", certHash);

  // Test retrieving certificate
  console.log("\nRetrieving certificate details...");
  const certificate = await certificateRegistry.getCertificateByHash(certHash);

  console.log("Certificate Details:");
  console.log("- Student:", certificate.student);
  console.log("- Student Name:", certificate.studentName);
  console.log("- Issuer:", certificate.issuer);
  console.log("- Issuer Name:", certificate.issuerName);
  console.log("- Course Name:", certificate.courseName);
  console.log("- Course Type:", certificate.courseType); // New field
  console.log("- Course Level:", certificate.courseLevel); // New field
  console.log(
    "- Issued Date:",
    new Date(Number(certificate.issuedDate) * 1000).toISOString()
  );
  console.log("- Metadata URI:", certificate.metadataURI);

  // Test multiple certificates with different types and levels
  console.log("\n=== Testing Multiple Certificates ===\n");

  const certificates = [
    {
      student: student1.address,
      studentName: "Nguyen Van A",
      courseName: "Smart Contract Programming",
      courseType: "Technology",
      courseLevel: "Advanced",
    },
    {
      student: student2.address,
      studentName: "Tran Thi B",
      courseName: "Business Management",
      courseType: "Business",
      courseLevel: "Intermediate",
    },
    {
      student: student1.address,
      studentName: "Nguyen Van A",
      courseName: "Web Development Basics",
      courseType: "Technology",
      courseLevel: "Beginner",
    },
  ];

  for (let i = 0; i < certificates.length; i++) {
    const cert = certificates[i];
    await certificateRegistry
      .connect(admin)
      .issueCertificate(
        cert.student,
        cert.studentName,
        issuer.address,
        "IUH University",
        cert.courseName,
        cert.courseType,
        cert.courseLevel,
        `ipfs://test-metadata-${i + 2}`
      );
    console.log(
      `✓ Certificate ${i + 2} issued: ${cert.courseName} (${cert.courseType}, ${
        cert.courseLevel
      })`
    );
  }

  // Test new search functions
  console.log("\n=== Testing New Search Functions ===\n");

  // Test search by course type
  console.log("Searching Technology certificates for student1...");
  const [techCerts, techTotal] =
    await certificateRegistry.getStudentCertificateByCourseType(
      student1.address,
      "Technology"
    );
  console.log(`Found ${techTotal} Technology certificates for student1:`);
  for (let cert of techCerts) {
    console.log(`- ${cert.courseName} (${cert.courseLevel})`);
  }

  // Test search by course level
  console.log("\nSearching Advanced level certificates for student1...");
  const [advancedCerts, advancedTotal] =
    await certificateRegistry.getStudentCertificateByCourseLevel(
      student1.address,
      "Advanced"
    );
  console.log(`Found ${advancedTotal} Advanced certificates for student1:`);
  for (let cert of advancedCerts) {
    console.log(`- ${cert.courseName} (${cert.courseType})`);
  }

  // Test admin search functions
  console.log("\nTesting admin search by course type...");
  const [allTechCerts, allTechTotal] = await certificateRegistry
    .connect(admin)
    .adminSearchByCourseType("Technology");
  console.log(
    `Found ${allTechTotal} Technology certificates across all students:`
  );
  for (let cert of allTechCerts) {
    console.log(
      `- ${cert.studentName}: ${cert.courseName} (${cert.courseLevel})`
    );
  }

  console.log("\nTesting admin search by course level...");
  const [allAdvancedCerts, allAdvancedTotal] = await certificateRegistry
    .connect(admin)
    .adminSearchByCourseLevel("Advanced");
  console.log(
    `Found ${allAdvancedTotal} Advanced certificates across all students:`
  );
  for (let cert of allAdvancedCerts) {
    console.log(
      `- ${cert.studentName}: ${cert.courseName} (${cert.courseType})`
    );
  }

  console.log("\n=== Deployment Test Completed Successfully! ===");
  console.log("\nContract Address:", contractAddress);
  console.log("All new features working properly!");

  // Export deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    admin: admin.address,
    issuer: issuer.address,
    student1: student1.address,
    student2: student2.address,
    deploymentTime: new Date().toISOString(),
    network: "hardhat",
    features: [
      "Certificate issuance with courseType and courseLevel",
      "Student search by course type",
      "Student search by course level",
      "Admin search by course type",
      "Admin search by course level",
      "All existing search functions maintained",
    ],
  };

  console.log("\nDeployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
