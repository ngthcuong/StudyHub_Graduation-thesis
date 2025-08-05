async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "ETH"
  );
}

main().catch(console.error);
