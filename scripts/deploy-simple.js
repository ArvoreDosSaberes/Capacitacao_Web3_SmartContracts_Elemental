/**
 * Script de deploy simplificado para Sepolia usando ethers.js
 */

const { ethers } = require("ethers");

async function main() {
  // Configuração da rede Sepolia
  const RPC_URL = process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  
  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY não configurado nas variáveis de ambiente");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying contracts with:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  // Compilação dos contratos
  const path = require("path");
  const artifactsPath = path.join(__dirname, "..", "artifacts");
  
  try {
    // 1. Deploy ElemToken
    console.log("Deploying ElemToken...");
    const elemTokenArtifact = require(`${artifactsPath}/ElemToken.json`);
    const elemTokenFactory = new ethers.ContractFactory(
      elemTokenArtifact.abi,
      elemTokenArtifact.data.bytecode.object,
      wallet
    );
    const elemToken = await elemTokenFactory.deploy(wallet.address);
    await elemToken.waitForDeployment();
    const elemTokenAddress = await elemToken.getAddress();
    console.log("ElemToken deployed at:", elemTokenAddress);

    // 2. Deploy ElemNFT
    console.log("Deploying ElemNFT...");
    const elemNFTArtifact = require(`${artifactsPath}/ElemNFT.json`);
    const elemNFTFactory = new ethers.ContractFactory(
      elemNFTArtifact.abi,
      elemNFTArtifact.data.bytecode.object,
      wallet
    );
    const elemNFT = await elemNFTFactory.deploy(wallet.address);
    await elemNFT.waitForDeployment();
    const elemNFTAddress = await elemNFT.getAddress();
    console.log("ElemNFT deployed at:", elemNFTAddress);

    // 3. Deploy PriceFeed
    console.log("Deploying PriceFeed...");
    const chainlinkFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const priceFeedArtifact = require(`${artifactsPath}/PriceFeed.json`);
    const priceFeedFactory = new ethers.ContractFactory(
      priceFeedArtifact.abi,
      priceFeedArtifact.data.bytecode.object,
      wallet
    );
    const priceFeed = await priceFeedFactory.deploy(chainlinkFeedAddress, wallet.address);
    await priceFeed.waitForDeployment();
    const priceFeedAddress = await priceFeed.getAddress();
    console.log("PriceFeed deployed at:", priceFeedAddress);

    // 4. Deploy ElemStaking
    console.log("Deploying ElemStaking...");
    const elemStakingArtifact = require(`${artifactsPath}/ElemStaking.json`);
    const elemStakingFactory = new ethers.ContractFactory(
      elemStakingArtifact.abi,
      elemStakingArtifact.data.bytecode.object,
      wallet
    );
    const elemStaking = await elemStakingFactory.deploy(elemTokenAddress, priceFeedAddress, wallet.address);
    await elemStaking.waitForDeployment();
    const elemStakingAddress = await elemStaking.getAddress();
    console.log("ElemStaking deployed at:", elemStakingAddress);

    // 5. Deploy ElemDAO
    console.log("Deploying ElemDAO...");
    const elemDAOArtifact = require(`${artifactsPath}/ElemDAO.json`);
    const elemDAOFactory = new ethers.ContractFactory(
      elemDAOArtifact.abi,
      elemDAOArtifact.data.bytecode.object,
      wallet
    );
    const elemDAO = await elemDAOFactory.deploy(elemTokenAddress, wallet.address);
    await elemDAO.waitForDeployment();
    const elemDAOAddress = await elemDAO.getAddress();
    console.log("ElemDAO deployed at:", elemDAOAddress);

    // 6. Deploy MockAggregator
    console.log("Deploying MockAggregator...");
    const mockAggregatorArtifact = require(`${artifactsPath}/MockAggregator.json`);
    const mockAggregatorFactory = new ethers.ContractFactory(
      mockAggregatorArtifact.abi,
      mockAggregatorArtifact.data.bytecode.object,
      wallet
    );
    const mockAggregator = await mockAggregatorFactory.deploy(200000000000, 8); // $2,000 USD with 8 decimals
    await mockAggregator.waitForDeployment();
    const mockAggregatorAddress = await mockAggregator.getAddress();
    console.log("MockAggregator deployed at:", mockAggregatorAddress);

    // Resumo dos endereços
    console.log("\n=== DEPLOY COMPLETO ===");
    console.log("ElemToken:", elemTokenAddress);
    console.log("ElemNFT:", elemNFTAddress);
    console.log("PriceFeed:", priceFeedAddress);
    console.log("ElemStaking:", elemStakingAddress);
    console.log("ElemDAO:", elemDAOAddress);
    console.log("MockAggregator:", mockAggregatorAddress);

    // Salvar endereços em arquivo JSON
    const addresses = {
      ElemToken: elemTokenAddress,
      ElemNFT: elemNFTAddress,
      PriceFeed: priceFeedAddress,
      ElemStaking: elemStakingAddress,
      ElemDAO: elemDAOAddress,
      MockAggregator: mockAggregatorAddress,
      deployer: wallet.address,
      network: "sepolia",
      timestamp: new Date().toISOString()
    };

    const fs = require("fs");
    fs.writeFileSync("deployed-addresses-sepolia.json", JSON.stringify(addresses, null, 2));
    console.log("\nEndereços salvos em deployed-addresses-sepolia.json");

  } catch (error) {
    console.error("Erro durante o deploy:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
