import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deployer address:", deployer.account.address);
  
  const balance = await deployer.getBalance();
  console.log(`Saldo: ${balance} wei`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
