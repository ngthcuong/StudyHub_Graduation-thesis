const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Exporting ABI and creating reference files...\n");

  // Đường dẫn tới file artifact
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "Certificate.sol",
    "CertificateRegistry.json"
  );

  if (!fs.existsSync(artifactPath)) {
    console.error(
      "Contract artifact not found. Please compile the contract first with: npx hardhat compile"
    );
    return;
  }

  // Đọc artifact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Tạo thư mục exports nếu chưa có
  const exportsDir = path.join(__dirname, "..", "exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Export ABI
  const abiPath = path.join(exportsDir, "CertificateRegistry.abi.json");
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
  console.log(`✓ ABI exported to: ${abiPath}`);

  // Export Bytecode
  const bytecodePath = path.join(
    exportsDir,
    "CertificateRegistry.bytecode.json"
  );
  const bytecodeData = {
    bytecode: artifact.bytecode,
    deployedBytecode: artifact.deployedBytecode,
    linkReferences: artifact.linkReferences,
    deployedLinkReferences: artifact.deployedLinkReferences,
  };
  fs.writeFileSync(bytecodePath, JSON.stringify(bytecodeData, null, 2));
  console.log(`✓ Bytecode exported to: ${bytecodePath}`);

  // Tạo complete artifact (bao gồm cả ABI và bytecode)
  const completeArtifactPath = path.join(
    exportsDir,
    "CertificateRegistry.complete.json"
  );
  fs.writeFileSync(completeArtifactPath, JSON.stringify(artifact, null, 2));
  console.log(`✓ Complete artifact exported to: ${completeArtifactPath}`);

  // Tạo method selector mapping
  const { ethers } = require("hardhat");
  const interface = new ethers.Interface(artifact.abi);

  const methodSelectors = {};
  const functions = Object.values(interface.fragments).filter(
    (fragment) => fragment.type === "function"
  );

  functions.forEach((func) => {
    const selector = interface.getFunction(func.name).selector;
    methodSelectors[selector] = {
      name: func.name,
      signature: func.format("full"),
      inputs: func.inputs.map((input) => ({
        name: input.name,
        type: input.type,
      })),
      outputs: func.outputs.map((output) => ({
        name: output.name,
        type: output.type,
      })),
    };
  });

  const selectorsPath = path.join(exportsDir, "method-selectors.json");
  fs.writeFileSync(selectorsPath, JSON.stringify(methodSelectors, null, 2));
  console.log(`✓ Method selectors exported to: ${selectorsPath}`);

  // Tạo human-readable method list
  const readableMethods = functions.map((func) => {
    const selector = interface.getFunction(func.name).selector;
    return {
      name: func.name,
      selector: selector,
      signature: func.format("full"),
      type: func.stateMutability,
      inputs: func.inputs.length,
      outputs: func.outputs.length,
    };
  });

  const readableMethodsPath = path.join(exportsDir, "methods-readable.json");
  fs.writeFileSync(
    readableMethodsPath,
    JSON.stringify(readableMethods, null, 2)
  );
  console.log(`✓ Readable methods list exported to: ${readableMethodsPath}`);

  console.log("\n=== Export Summary ===");
  console.log(`Total functions exported: ${functions.length}`);
  console.log(`Files created in ${exportsDir}:`);
  console.log("- CertificateRegistry.abi.json (ABI only)");
  console.log("- CertificateRegistry.bytecode.json (Bytecode only)");
  console.log("- CertificateRegistry.complete.json (Complete artifact)");
  console.log("- method-selectors.json (Method ID mapping)");
  console.log("- methods-readable.json (Human-readable method list)");

  console.log("\n=== Usage ===");
  console.log(
    "1. Import ABI in frontend: const abi = require('./exports/CertificateRegistry.abi.json')"
  );
  console.log("2. Use method-selectors.json to decode transaction method IDs");
  console.log("3. Refer to methods-readable.json for quick function overview");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
