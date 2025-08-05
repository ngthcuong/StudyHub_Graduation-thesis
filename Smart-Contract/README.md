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

# 1. Compile để đảm bảo contract OK

npx hardhat compile

# 2. Check balance

npx hardhat run scripts/check-balance.js --network sepolia

# 3. Deploy!

npx hardhat ignition deploy ignition/modules/Certificate.js --network sepolia
