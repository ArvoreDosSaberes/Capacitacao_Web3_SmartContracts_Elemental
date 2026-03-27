import hre from "hardhat";

async function main() {
  console.log("🔍 Verificando configuração de rede Sepolia");
  console.log("==========================================");

  try {
    // Verificar se consegue conectar à Sepolia
    console.log("📡 Testando conexão com Sepolia...");
    
    // Obter a primeira conta configurada
    const accounts = await hre.viem.getWalletClients();
    
    if (accounts.length === 0) {
      console.log("❌ Nenhuma conta configurada para Sepolia");
      return;
    }

    const deployer = accounts[0];
    console.log("✅ Conexão bem-sucedida!");
    console.log(`📍 Deployer Address: ${deployer.account.address}`);
    
    // Verificar saldo
    const balance = await deployer.getBalance();
    const balanceEth = Number(balance) / 10**18;
    
    console.log(`💰 Saldo: ${balanceEth.toFixed(6)} ETH`);
    
    if (balanceEth < 0.01) {
      console.log("⚠️  Saldo baixo! Consiga mais ETH em sepoliafaucet.com");
    } else {
      console.log("✅ Saldo suficiente para deploy");
    }

    // Verificar preço do gas
    const gasPrice = await deployer.getGasPrice();
    const gasPriceGwei = Number(gasPrice) / 10**9;
    
    console.log(`⛽ Gas Price: ${gasPriceGwei.toFixed(2)} Gwei`);
    
    // Estimar custo de deploy (aproximado)
    const estimatedDeployCost = 0.005; // 0.005 ETH aprox
    console.log(`💸 Custo estimado de deploy: ~${estimatedDeployCost} ETH`);
    
  } catch (error) {
    console.error("❌ Erro ao verificar Sepolia:");
    console.error(error.message);
    
    console.log("\n🔧 Soluções possíveis:");
    console.log("1. Verifique se SEPOLIA_RPC_URL está configurado");
    console.log("2. Verifique se SEPOLIA_PRIVATE_KEY está configurado");
    console.log("3. Use './scripts/hardhat-learning.sh 11' para verificar contas");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
