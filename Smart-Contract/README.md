# Certificate Registry Smart Contract

This project contains the Certificate Registry smart contract with enhanced features for storing and managing educational certificates on blockchain.

## 📋 **Certificate Structure**

```solidity
struct Certificate {
    bytes32 certHash;        // Unique certificate hash
    address issuer;          // Issuer organization address
    string issuerName;       // Issuer organization name
    address student;         // Student wallet address
    string studentName;      // Student name
    string courseName;       // Course name
    string courseType;       // Course type (Technology, Business, etc.)
    string courseLevel;      // Course level (Beginner, Intermediate, Advanced)
    uint256 issuedDate;      // Issue timestamp
    string metadataURI;      // IPFS/URL for detailed certificate info
}
```

## 🔧 **Available Scripts**

### Core Development Commands

```shell
# Install dependencies
npm install

# Clean previous builds
npx hardhat clean

# Compile contracts
npx hardhat compile

# Run all tests (66 test cases)
npx hardhat test

# Run specific test suites
npx hardhat test --grep "Extended Search"
npx hardhat test --grep "Admin Search"
npx hardhat test --grep "Student Search"

# Generate gas report
REPORT_GAS=true npx hardhat test
```

### New Utility Scripts

```shell
# Check method IDs and signatures (Method ID)
npx hardhat run scripts/check-method-ids.js

# Export ABI and create integration files
npx hardhat run scripts/export-abi.js

# Test deployment with new structure
npx hardhat run scripts/test-deployment.js

# Check wallet balance
npx hardhat run scripts/check-balance.js --network sepolia
```

## 🔍 **Method IDs và Blockchain Explorer**

**Vấn đề**: Blockchain explorers hiển thị Method ID (như `0xd45069a9`) thay vì tên function.

**Giải pháp**: Sử dụng files trong `exports/` để decode:

### Key Method IDs:

| Function                             | Method ID    | Description                  |
| ------------------------------------ | ------------ | ---------------------------- |
| `issueCertificate`                   | `0xd45069a9` | Issue new certificate        |
| `getCertificateByHash`               | `0x90ab95cb` | Get certificate by hash      |
| `getAllCertificates`                 | `0x13fcfe80` | Get all certificates (admin) |
| `getStudentCertificatesByStudent`    | `0x20c7e945` | Get student's certificates   |
| `getStudentCertificateByCourseType`  | `0x74c7b8e7` | Search by course type        |
| `getStudentCertificateByCourseLevel` | `0x6cd93f7a` | Search by course level       |
| `adminSearchByCourse`                | `0x86258d34` | Admin search by course       |
| `adminSearchByCourseType`            | `0x58f0d1ec` | Admin search by type         |
| `adminSearchByCourseLevel`           | `0xb24633f4` | Admin search by level        |

**📖 Xem thêm**: `docs/METHOD_IDS.md` để có danh sách đầy đủ.

## 🧪 **Testing**

### Test Suites:

- **Certificate.deployment.test.js** - Contract deployment (3 tests)
- **Certificate.issuing.test.js** - Certificate issuance (5 tests)
- **Certificate.basic-queries.test.js** - Basic queries (8 tests)
- **Certificate.student-search.test.js** - Student search functions (16 tests)
- **Certificate.admin-search.test.js** - Admin search functions (16 tests)
- **Certificate.extended-search.test.js** - New search features (18 tests)

### Test Commands:

```bash
# Run all tests
npx hardhat test

# Run specific test files
npx hardhat test test/Certificate.extended-search.test.js
npx hardhat test test/Certificate.issuing.test.js

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Test specific functionality
npx hardhat test --grep "courseType"
npx hardhat test --grep "courseLevel"
```

## 📊 **Contract Features**

### Student Functions (Public):

- Get all certificates by student address
- Search certificates by course name
- Search certificates by course type
- Search certificates by course level
- Search certificates by date range
- Get specific certificate by hash

### Admin Functions (Restricted):

- Issue new certificates with type & level
- Get all certificates in system
- Search across all certificates by course name
- Search across all certificates by course type
- Search across all certificates by course level
- Search across all certificates by student name
- Search across all certificates by date range

### Access Control:

- Role-based access control (OpenZeppelin)
- ADMIN_ROLE required for admin functions
- Certificate issuance restricted to admins

## 🚀 **Quick Start Workflow**

### 1. Development Setup

```bash
# Install dependencies
npm install

# Clean and compile
npx hardhat clean
npx hardhat compile

# Run tests to verify everything works
npx hardhat test
```

### 2. Generate Integration Files

```bash
# Export ABI and method selectors for frontend/backend
npx hardhat run scripts/export-abi.js

# Check method IDs (giải quyết vấn đề Method ID trong explorer)
npx hardhat run scripts/check-method-ids.js

# Test deployment locally
npx hardhat run scripts/test-deployment.js
```

### 3. Deploy to Testnet

```bash
# Check deployer balance
npx hardhat run scripts/check-balance.js --network sepolia

# Deploy contract
npx hardhat ignition deploy ignition/modules/Certificate.js --network sepolia --reset

# Verify deployment
npx hardhat run scripts/test-deployment.js --network sepolia
```

## 📁 **Generated Files for Integration**

After running `npx hardhat run scripts/export-abi.js`, you'll get:

```
exports/
├── CertificateRegistry.abi.json          # ABI for frontend/backend
├── CertificateRegistry.bytecode.json     # Bytecode for deployment
├── CertificateRegistry.complete.json     # Complete artifact
├── method-selectors.json                 # Method ID mapping
└── methods-readable.json                 # Human-readable method list
```

**Usage in Frontend/Backend:**

```javascript
// Import ABI
const abi = require("./exports/CertificateRegistry.abi.json");

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, provider);

// Decode method IDs from transactions
const methodSelectors = require("./exports/method-selectors.json");
const methodInfo = methodSelectors["0xd45069a9"]; // issueCertificate
```

## 🌐 **Deployment Information**

### Sepolia Testnet (Previous Deployment)

```
Contract: CertificateRegistry
Address: 0xA7e26a452bB85Ea2fC207a684663D8dE5650d57c
Deployer: 0xB71327c4D0A7916c7874a025C766B4e482008db3
Network: Sepolia (Chain ID: 11155111)
Etherscan: https://sepolia.etherscan.io/address/0xA7e26a452bB85Ea2fC207a684663D8dE5650d57c
```

### Deployment Steps for Updated Contract:

```bash
# 0. Clean artifacts
npx hardhat clean

# 1. Compile updated contract
npx hardhat compile

# 2. Check balance
npx hardhat run scripts/check-balance.js --network sepolia

# 3. Deploy updated contract with new structure
npx hardhat ignition deploy ignition/modules/Certificate.js --network sepolia --reset

# 4. Test deployment
npx hardhat run scripts/test-deployment.js --network sepolia

# 5. Export integration files
npx hardhat run scripts/export-abi.js
```

## 📚 **Documentation Files**

- `README.md` - This file, complete project documentation
- `UPDATE_SUMMARY.md` - Summary of recent changes and new features
- `docs/METHOD_IDS.md` - Complete method ID reference
- `exports/methods-readable.json` - Human-readable method list

## 🔗 **Integration Guide**

### For Frontend (React/Vue/Angular):

```javascript
// 1. Copy exports folder to your frontend project
// 2. Import ABI
import contractABI from "./exports/CertificateRegistry.abi.json";

// 3. Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// 4. Call functions with new parameters
await contract.issueCertificate(
  studentAddress,
  "Student Name",
  issuerAddress,
  "University Name",
  "Course Name",
  "Technology", // courseType
  "Advanced", // courseLevel
  "ipfs://..." // metadataURI
);
```

### For Backend (Node.js):

```javascript
// 1. Install required packages
// npm install ethers hardhat

// 2. Import ABI and setup
const { ethers } = require("ethers");
const contractABI = require("./exports/CertificateRegistry.abi.json");

// 3. Setup provider and contract
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// 4. Read certificates with new search functions
const techCerts = await contract.getStudentCertificateByCourseType(
  studentAddress,
  "Technology"
);
```
