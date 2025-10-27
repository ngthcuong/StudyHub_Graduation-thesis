# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Cetificate.js
```

### Sepolia Testnet

```
Contract: CertificateRegistry
Address: 0xCbE76d12b957d5180A7E6CD6E6Ae6E08C8b4aAD8
Network: Sepolia (Chain ID: 11155111)
Deployed: 05/08/2025
Block:
Deployer: 0xB71327c4D0A7916c7874a025C766B4e482008db3
Etherscan: https://sepolia.etherscan.io/address/0xCbE76d12b957d5180A7E6CD6E6Ae6E08C8b4aAD8
```

### Local Development

```bash
# Deploy locally
npm run deploy:local

# Check deployment
npm run deployment:info
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Deploy to Sepolia
npm run deploy:sepolia

# Run tests
npm test
```

### 0: Clean artifacts

npx hardhat clean

### 1. Compile để đảm bảo contract OK

npx hardhat compile

### 2. Check balance

npx hardhat run scripts/check-balance.js --network sepolia

### 3. Deploy!

npx hardhat ignition deploy ignition/modules/Certificate.js --network sepolia --reset

### 4. Export ABI

npx hardhat run scripts/export-abi.js

The following files are created in the `exports/` folder:

```
exports/
├── CertificateRegistry.abi.json       # Pure ABI for frontend/backend
├── CertificateRegistry.bytecode.json  # Bytecode for deployment
├── CertificateRegistry.complete.json  # Complete artifact
├── method-selectors.json              # Method ID → Function mapping
└── methods-readable.json              # Human-readable function list
```

```solidity
struct Certificate {
    bytes32 certHash;       // Unique certificate hash (keccak256)
    address issuer;         // Issuer's wallet address
    string issuerName;      // Issuer's name
    address student;        // Student's wallet address
    string studentName;     // Student's name
    string courseName;      // Course/subject name
    string courseType;      // NEW: Course category (e.g., "Programming", "Design")
    string courseLevel;     // NEW: Course difficulty (e.g., "Beginner", "Advanced")
    uint256 issuedDate;     // Issue timestamp
    string metadataURI;     // URI to detailed certificate info (IPFS/URL)
}
```
