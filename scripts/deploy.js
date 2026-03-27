/**
 * Script de deploy dos contratos do Elemental Protocol.
 *
 * Hardhat v3 + viem:
 *   npx hardhat run scripts/deploy.js --network sepolia
 *
 * Para deploy via Ignition (recomendado):
 *   npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia
 */

import { network } from "hardhat";
import { formatEther, getAddress } from "viem";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const [deployer] = await viem.getWalletClients();
const deployerAddress = deployer.account.address;

const balance = await publicClient.getBalance({ address: deployerAddress });
console.log("Deploying contracts with:", deployerAddress);
console.log("Balance:", formatEther(balance), "ETH\n");

// 1. Deploy ElemToken
const elemToken = await viem.deployContract("ElemToken", [deployerAddress]);
console.log("ElemToken deployed at:", elemToken.address);

// 2. Deploy ElemNFT
const elemNFT = await viem.deployContract("ElemNFT", [deployerAddress]);
console.log("ElemNFT deployed at:", elemNFT.address);

// 3. Deploy PriceFeed
// Chainlink ETH/USD em Sepolia: 0x694AA1769357215DE4FAC081bf1f309aDC325306
const CHAINLINK_ETH_USD_SEPOLIA = getAddress("0x694AA1769357215DE4FAC081bf1f309aDC325306");
const priceFeed = await viem.deployContract("PriceFeed", [CHAINLINK_ETH_USD_SEPOLIA, deployerAddress]);
console.log("PriceFeed deployed at:", priceFeed.address);

// 4. Deploy ElemStaking
const elemStaking = await viem.deployContract("ElemStaking", [
    elemToken.address,
    priceFeed.address,
    deployerAddress,
]);
console.log("ElemStaking deployed at:", elemStaking.address);

// 5. Deploy ElemDAO
const elemDAO = await viem.deployContract("ElemDAO", [elemToken.address, deployerAddress]);
console.log("ElemDAO deployed at:", elemDAO.address);

// Resumo
console.log("\n========================================");
console.log("DEPLOY COMPLETO – Elemental Protocol");
console.log("========================================");
console.log("ElemToken  :", elemToken.address);
console.log("ElemNFT    :", elemNFT.address);
console.log("PriceFeed  :", priceFeed.address);
console.log("ElemStaking:", elemStaking.address);
console.log("ElemDAO    :", elemDAO.address);
console.log("========================================");
console.log("\nAtualize os endereços em ui/js/app.js (ADDRESSES)");
