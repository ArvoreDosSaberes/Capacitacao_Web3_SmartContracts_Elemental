import hre from "hardhat";

async function main() {
  console.log("🧪 Teste Interativo de Contratos - Hardhat Local");
  console.log("==============================================");

  try {
    // Deploy contratos para teste
    console.log("📦 Deployando contratos para teste...");
    
    // Deploy ElemToken
    const elemToken = await hre.viem.deployContract("ElemToken", [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // Endereço padrão do Hardhat
    ]);
    console.log(`✅ ElemToken deployado: ${elemToken.address}`);

    // Deploy ElemNFT
    const elemNFT = await hre.viem.deployContract("ElemNFT", [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ]);
    console.log(`✅ ElemNFT deployado: ${elemNFT.address}`);

    // Deploy PriceFeed (mock)
    const priceFeed = await hre.viem.deployContract("PriceFeed", [
      "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Chainlink mock
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ]);
    console.log(`✅ PriceFeed deployado: ${priceFeed.address}`);

    // Deploy ElemStaking
    const elemStaking = await hre.viem.deployContract("ElemStaking", [
      elemToken.address,
      priceFeed.address,
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ]);
    console.log(`✅ ElemStaking deployado: ${elemStaking.address}`);

    console.log("\n🎮 Iniciando testes interativos...");
    
    // Test 1: Verificar informações do token
    console.log("\n📊 Teste 1: Informações do ElemToken");
    const tokenName = await elemToken.read.name();
    const tokenSymbol = await elemToken.read.symbol();
    const totalSupply = await elemToken.read.totalSupply();
    
    console.log(`   Nome: ${tokenName}`);
    console.log(`   Símbolo: ${tokenSymbol}`);
    console.log(`   Supply Total: ${totalSupply} wei`);

    // Test 2: Verificar informações do NFT
    console.log("\n🖼️  Teste 2: Informações do ElemNFT");
    const nftName = await elemNFT.read.name();
    const nftSymbol = await elemNFT.read.symbol();
    const maxSupply = await elemNFT.read.MAX_SUPPLY();
    
    console.log(`   Nome: ${nftName}`);
    console.log(`   Símbolo: ${nftSymbol}`);
    console.log(`   Max Supply: ${maxSupply}`);

    // Test 3: Mint de NFT (pagando)
    console.log("\n🎨 Teste 3: Mint de NFT");
    const mintPrice = await elemNFT.read.MINT_PRICE();
    console.log(`   Preço de Mint: ${mintPrice} wei`);
    
    try {
      await elemNFT.write.mint(["ipfs://test-uri-1"], {
        value: mintPrice
      });
      console.log("✅ NFT mintado com sucesso!");
      
      const totalSupplyNFT = await elemNFT.read.totalSupply();
      console.log(`   Total NFTs: ${totalSupplyNFT}`);
      
      const owner = await elemNFT.read.ownerOf([0n]);
      console.log(`   Dono do NFT #0: ${owner}`);
      
    } catch (error) {
      console.log("❌ Erro no mint:", error.message);
    }

    // Test 4: Staking
    console.log("\n🔒 Teste 4: Staking de Tokens");
    
    try {
      // Aprovar tokens para staking
      const stakeAmount = 1000n * 10n**18n; // 1000 tokens
      await elemToken.write.approve([elemStaking.address, stakeAmount]);
      console.log("✅ Tokens aprovados para staking");
      
      // Fazer stake
      await elemStaking.write.stake([stakeAmount]);
      console.log(`✅ Stake de ${stakeAmount} tokens realizado`);
      
      // Verificar informações do stake
      const stakeInfo = await elemStaking.read.getUserStake([
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      ]);
      
      console.log(`   Amount: ${stakeInfo.amount}`);
      console.log(`   Timestamp: ${stakeInfo.timestamp}`);
      
    } catch (error) {
      console.log("❌ Erro no staking:", error.message);
    }

    // Test 5: Leitura de preço
    console.log("\n💰 Teste 5: Leitura de Preço");
    
    try {
      const price = await priceFeed.read.getLatestPrice();
      console.log(`   Preço ETH/USD: ${price} (8 decimals)`);
      
      // Converter para valor legível
      const priceUsd = Number(price) / 10**8;
      console.log(`   Preço ETH/USD: $${priceUsd.toFixed(2)}`);
      
    } catch (error) {
      console.log("❌ Erro na leitura de preço:", error.message);
    }

    console.log("\n🎉 Testes concluídos com sucesso!");
    console.log("📝 Endereços dos contratos:");
    console.log(`   ElemToken: ${elemToken.address}`);
    console.log(`   ElemNFT: ${elemNFT.address}`);
    console.log(`   PriceFeed: ${priceFeed.address}`);
    console.log(`   ElemStaking: ${elemStaking.address}`);

  } catch (error) {
    console.error("❌ Erro nos testes:");
    console.error(error.message);
    
    console.log("\n🔧 Dicas:");
    console.log("1. Certifique-se de que os contratos estão compilados");
    console.log("2. Use './scripts/hardhat-learning.sh 1' para compilar");
    console.log("3. Verifique se o nó local está rodando");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
