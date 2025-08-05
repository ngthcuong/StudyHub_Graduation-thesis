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
Address: 0xdDD8585206D51f17Ea82c5767FeA5f7805015f0E
Network: Sepolia (Chain ID: 11155111)
Deployed: 05/08/2025
Block:
Deployer: 0xB71327c4D0A7916c7874a025C766B4e482008db3
Etherscan: https://sepolia.etherscan.io/address/0xdDD8585206D51f17Ea82c5767FeA5f7805015f0E
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

# 0: Clean artifacts

npx hardhat clean

# 1. Compile để đảm bảo contract OK

npx hardhat compile

# 2. Check balance

npx hardhat run scripts/check-balance.js --network sepolia

# 3. Deploy!

npx hardhat ignition deploy ignition/modules/Certificate.js --network sepolia
