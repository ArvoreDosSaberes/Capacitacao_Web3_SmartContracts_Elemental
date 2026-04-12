/**
 * Script para finalizar o deploy dos contratos restantes
 */

const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

async function main() {
  const RPC_URL = process.env.SEPOLIA_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  
  if (!PRIVATE_KEY || !RPC_URL) {
    throw new Error("PRIVATE_KEY e SEPOLIA_URL devem estar configurados");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Finalizando deploy com:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  const artifactsPath = path.join(__dirname, "..", "artifacts");

  try {
    // Deploy ElemDAO
    console.log("Deploying ElemDAO...");
    const elemDAOArtifact = require(`${artifactsPath}/ElemDAO.json`);
    const elemDAOFactory = new ethers.ContractFactory(
      elemDAOArtifact.abi,
      elemDAOArtifact.data.bytecode.object,
      wallet
    );

    // Usar endereço do ElemToken já deployado
    const elemTokenAddress = "0x54f40dd929A41E8c3aC858b426058298Fee94663";
    const elemDAO = await elemDAOFactory.deploy(elemTokenAddress, wallet.address);
    await elemDAO.waitForDeployment();
    const elemDAOAddress = await elemDAO.getAddress();
    console.log("ElemDAO deployed at:", elemDAOAddress);

    // Deploy MockAggregator
    console.log("Deploying MockAggregator...");
    const mockAggregatorArtifact = require(`${artifactsPath}/MockAggregator.json`);
    const mockAggregatorFactory = new ethers.ContractFactory(
      mockAggregatorArtifact.abi,
      mockAggregatorArtifact.data.bytecode.object,
      wallet
    );
    const mockAggregator = await mockAggregatorFactory.deploy(200000000000, 8);
    await mockAggregator.waitForDeployment();
    const mockAggregatorAddress = await mockAggregator.getAddress();
    console.log("MockAggregator deployed at:", mockAggregatorAddress);

    // Resumo final
    console.log("\n=== DEPLOY COMPLETO ===");
    console.log("ElemToken:", elemTokenAddress);
    console.log("ElemNFT: 0x910311e288AB3303d1b279b42e9C81BD1b40Fd7A");
    console.log("PriceFeed: 0x359ea7Fc304DA0B02FfDA71c409db79A7371CB1E");
    console.log("ElemStaking: 0xBAfaFBFcdDF337bf6Dce76182FaEB375505114BF");
    console.log("ElemDAO:", elemDAOAddress);
    console.log("MockAggregator:", mockAggregatorAddress);

    // Salvar endereços
    const addresses = {
      ElemToken: elemTokenAddress,
      ElemNFT: "0x910311e288AB3303d1b279b42e9C81BD1b40Fd7A",
      PriceFeed: "0x359ea7Fc304DA0B02FfDA71c409db79A7371CB1E",
      ElemStaking: "0xBAfaFBFcdDF337bf6Dce76182FaEB375505114BF",
      ElemDAO: elemDAOAddress,
      MockAggregator: mockAggregatorAddress,
      deployer: wallet.address,
      network: "sepolia",
      timestamp: new Date().toISOString()
    };

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
