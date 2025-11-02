const { ethers } = require("hardhat");

async function main() {
  console.log("=== Certificate Registry Method Signatures ===\n");

  // Deploy contract để lấy interface
  const CertificateRegistry = await ethers.getContractFactory(
    "CertificateRegistry"
  );
  const contract = await CertificateRegistry.deploy();

  // Lấy tất cả functions từ contract interface
  const interface = contract.interface;

  console.log("All function signatures and their method IDs:\n");

  // Lấy tất cả function fragments
  const functions = Object.values(interface.fragments).filter(
    (fragment) => fragment.type === "function"
  );

  functions.forEach((func) => {
    const signature = func.format("full");
    const selector = interface.getFunction(func.name).selector;

    console.log(`Function: ${func.name}`);
    console.log(`Full Signature: ${signature}`);
    console.log(`Method ID (Selector): ${selector}`);
    console.log(`Method ID (4 bytes): ${selector.slice(0, 10)}`);
    console.log("---");
  });

  console.log("\n=== Specific Functions for Certificate Management ===\n");

  // Các function quan trọng
  const importantFunctions = [
    "issueCertificate",
    "getCertificateByHash",
    "getAllCertificates",
    "getStudentCertificatesByStudent",
    "adminSearchByCourse",
    "adminSearchByStudentName",
  ];

  importantFunctions.forEach((funcName) => {
    try {
      const func = interface.getFunction(funcName);
      console.log(`${funcName}:`);
      console.log(`  Method ID: ${func.selector}`);
      console.log(`  4-byte ID: ${func.selector.slice(0, 10)}`);
      console.log(`  Signature: ${func.format("full")}`);
      console.log("");
    } catch (error) {
      console.log(`${funcName}: Function not found`);
    }
  });

  console.log("=== Method ID Explanation ===");
  console.log(
    "In blockchain explorers like Etherscan, transactions show the method ID"
  );
  console.log(
    "instead of function names for gas efficiency. The method ID is the first"
  );
  console.log("4 bytes of the Keccak256 hash of the function signature.");
  console.log("\nFor example:");
  console.log(
    "- Function: issueCertificate(address,string,address,string,string,string,string,string)"
  );
  console.log("- Method ID: 0x... (first 4 bytes of Keccak256 hash)");
  console.log(
    "\nThis is why you see method IDs instead of function names in the explorer."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
