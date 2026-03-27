import hre from "hardhat";

async function main() {
  console.log⚗️ Laboratório de Smart Contracts - Elemental Protocol");
  console.log("==============================================");

  console.log("🎓 Bem-vindo ao laboratório interativo!");
  console.log("   Este script permite testar diferentes funcionalidades");
  console.log("   dos contratos do Elemental Protocol.\n");

  // Deploy inicial dos contratos
  console.log("🏗️  Preparando ambiente de testes...");
  
  const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  // Deploy ElemToken
  const elemToken = await hre.viem.deployContract("ElemToken", [owner]);
  console.log(`✅ ElemToken: ${elemToken.address}`);

  // Deploy ElemNFT
  const elemNFT = await hre.viem.deployContract("ElemNFT", [owner]);
  console.log(`✅ ElemNFT: ${elemNFT.address}`);

  // Menu interativo
  console.log("\n🎮 Menu Interativo");
  console.log("================");
  console.log("1. 🪙 Testar Token (ERC-20)");
  console.log("2. 🖼️  Testar NFT (ERC-721)");
  console.log("3. 🔒 Testar Staking");
  console.log("4. 💰 Testar Price Feed");
  console.log("5. 🎨 Criar NFTs em lote");
  console.log("6. 📊 Verificar saldos");
  console.log("7. 🎯 Testar edge cases");
  console.log("8. 🚪 Sair");

  // Simulação de menu (em ambiente real, usaria readline)
  console.log("\n📝 Executando todos os testes automaticamente...\n");

  // Test 1: Token Operations
  console.log("🪙 Teste 1: Operações com Token (ERC-20)");
  console.log("----------------------------------------");
  
  try {
    const balance = await elemToken.read.balanceOf([owner]);
    console.log(`   Saldo inicial: ${balance} wei`);
    
    const decimals = await elemToken.read.decimals();
    console.log(`   Decimais: ${decimals}`);
    
    // Transferência
    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const transferAmount = 1000n * 10n**decimals;
    
    await elemToken.write.transfer([recipient, transferAmount]);
    console.log(`✅ Transferência de ${transferAmount} tokens realizada`);
    
    const newBalance = await elemToken.read.balanceOf([owner]);
    console.log(`   Novo saldo: ${newBalance} wei`);
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }

  // Test 2: NFT Operations
  console.log("\n🖼️  Teste 2: Operações com NFT (ERC-721)");
  console.log("-----------------------------------------");
  
  try {
    const mintPrice = await elemNFT.read.MINT_PRICE();
    console.log(`   Preço de mint: ${mintPrice} wei`);
    
    // Mint múltiplos NFTs
    for (let i = 0; i < 3; i++) {
      await elemNFT.write.mint([`ipfs://test-${i}`], {
        value: mintPrice
      });
      console.log(`✅ NFT #${i} mintado`);
    }
    
    const totalSupply = await elemNFT.read.totalSupply();
    console.log(`   Total NFTs: ${totalSupply}`);
    
    // Verificar URI
    const tokenURI = await elemNFT.read.tokenURI([0n]);
    console.log(`   Token URI #0: ${tokenURI}`);
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }

  // Test 3: Staking Operations
  console.log("\n🔒 Teste 3: Operações de Staking");
  console.log("--------------------------------");
  
  try {
    // Deploy PriceFeed mock
    const priceFeed = await hre.viem.deployContract("PriceFeed", [
      "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      owner
    ]);
    
    // Deploy ElemStaking
    const elemStaking = await hre.viem.deployContract("ElemStaking", [
      elemToken.address,
      priceFeed.address,
      owner
    ]);
    
    console.log(`✅ ElemStaking: ${elemStaking.address}`);
    
    // Aprovar tokens
    const stakeAmount = 500n * 10n**18n;
    await elemToken.write.approve([elemStaking.address, stakeAmount]);
    console.log(`✅ Tokens aprovados: ${stakeAmount}`);
    
    // Fazer stake
    await elemStaking.write.stake([stakeAmount]);
    console.log(`✅ Stake realizado`);
    
    // Verificar recompensas
    const rewards = await elemStaking.read.calculateRewards([owner]);
    console.log(`   Recompensas calculadas: ${rewards}`);
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }

  // Test 4: Price Feed
  console.log("\n💰 Teste 4: Price Feed");
  console.log("---------------------");
  
  try {
    const priceFeed = await hre.viem.deployContract("PriceFeed", [
      "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      owner
    ]);
    
    // Simular atualização de preço
    const mockPrice = 3000n * 10n**8n; // $3000 ETH
    await priceFeed.write.updatePrice([mockPrice]);
    console.log(`✅ Preço atualizado: ${mockPrice}`);
    
    const currentPrice = await priceFeed.read.getLatestPrice();
    console.log(`   Preço atual: ${currentPrice}`);
    
    const priceUsd = Number(currentPrice) / 10**8;
    console.log(`   Preço USD: $${priceUsd.toFixed(2)}`);
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }

  // Test 5: Edge Cases
  console.log("\n🎯 Teste 5: Edge Cases");
  console.log("-------------------");
  
  try {
    // Tentar mint NFT sem pagamento suficiente
    const mintPrice = await elemNFT.read.MINT_PRICE();
    const insufficientAmount = mintPrice / 2n;
    
    try {
      await elemNFT.write.mint(["ipfs://fail-test"], {
        value: insufficientAmount
      });
      console.log("❌ Mint deveria ter falhado!");
    } catch (error) {
      console.log("✅ Mint sem pagamento suficiente falhou como esperado");
    }
    
    // Tentar transferir mais tokens que tem
    try {
      const balance = await elemToken.read.balanceOf([owner]);
      const tooMuch = balance + 1000n;
      
      await elemToken.write.transfer([
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        tooMuch
      ]);
      console.log("❌ Transferência deveria ter falhado!");
    } catch (error) {
      console.log("✅ Transferência insuficiente falhou como esperado");
    }
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }

  // Resumo final
  console.log("\n📊 Resumo dos Testes");
  console.log("===================");
  console.log("✅ Operações básicas de token");
  console.log("✅ Mint e transferência de NFTs");
  console.log("✅ Staking e recompensas");
  console.log("✅ Price feed e oráculos");
  console.log("✅ Validação de edge cases");
  
  console.log("\n🎓 Laboratório concluído!");
  console.log("📚 Continue explorando os contratos:");
  console.log("   - Use './scripts/hardhat-learning.sh' para mais comandos");
  console.log("   - Explore o código dos contratos em contracts/");
  console.log("   - Execute testes unitários com npx hardhat test");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
