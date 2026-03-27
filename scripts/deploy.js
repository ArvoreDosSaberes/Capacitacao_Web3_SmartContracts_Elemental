/**
 * Script de deploy dos contratos do Elemental Protocol.
 * Uso com Hardhat: npx hardhat run scripts/deploy.js --network sepolia
 * Ou adaptável para Remix IDE (copiar lógica para console do Remix).
 */

const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with:", deployer.address);
    console.log("Balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

    // 1. Deploy ElemToken
    const ElemToken = await hre.ethers.getContractFactory("ElemToken");
    const token = await ElemToken.deploy(deployer.address);
    await token.deployed();
    console.log("ElemToken deployed at:", token.address);

    // 2. Deploy ElemNFT
    const ElemNFT = await hre.ethers.getContractFactory("ElemNFT");
    const nft = await ElemNFT.deploy(deployer.address);
    await nft.deployed();
    console.log("ElemNFT deployed at:", nft.address);

    // 3. Deploy PriceFeed
    // Chainlink ETH/USD em Sepolia: 0x694AA1769357215DE4FAC081bf1f309aDC325306
    const CHAINLINK_ETH_USD_SEPOLIA = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const PriceFeed = await hre.ethers.getContractFactory("PriceFeed");
    const priceFeed = await PriceFeed.deploy(CHAINLINK_ETH_USD_SEPOLIA, deployer.address);
    await priceFeed.deployed();
    console.log("PriceFeed deployed at:", priceFeed.address);

    // 4. Deploy ElemStaking
    const ElemStaking = await hre.ethers.getContractFactory("ElemStaking");
    const staking = await ElemStaking.deploy(token.address, priceFeed.address, deployer.address);
    await staking.deployed();
    console.log("ElemStaking deployed at:", staking.address);

    // 5. Deploy ElemDAO
    const ElemDAO = await hre.ethers.getContractFactory("ElemDAO");
    const dao = await ElemDAO.deploy(token.address, deployer.address);
    await dao.deployed();
    console.log("ElemDAO deployed at:", dao.address);

    // Resumo
    console.log("\n========================================");
    console.log("DEPLOY COMPLETO – Elemental Protocol");
    console.log("========================================");
    console.log("ElemToken  :", token.address);
    console.log("ElemNFT    :", nft.address);
    console.log("PriceFeed  :", priceFeed.address);
    console.log("ElemStaking:", staking.address);
    console.log("ElemDAO    :", dao.address);
    console.log("========================================");
    console.log("\nAtualize os endereços em ui/js/app.js (ADDRESSES)");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
