import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Módulo Hardhat Ignition para deploy completo do Elemental Protocol.
 *
 * Ordem de deploy:
 *   1. ElemToken   (ERC-20)
 *   2. ElemNFT     (ERC-721)
 *   3. PriceFeed   (Chainlink wrapper)
 *   4. ElemStaking  (depende de ElemToken + PriceFeed)
 *   5. ElemDAO      (depende de ElemToken)
 */
export default buildModule("ElementalProtocolModule", (m) => {
  // Parâmetros configuráveis
  const deployer = m.getAccount(0);

  // Chainlink ETH/USD em Sepolia: 0x694AA1769357215DE4FAC081bf1f309aDC325306
  const chainlinkFeedAddress = m.getParameter(
    "chainlinkFeedAddress",
    "0x694AA1769357215DE4FAC081bf1f309aDC325306"
  );

  // 1. ElemToken
  const elemToken = m.contract("ElemToken", [deployer]);

  // 2. ElemNFT
  const elemNFT = m.contract("ElemNFT", [deployer]);

  // 3. PriceFeed
  const priceFeed = m.contract("PriceFeed", [chainlinkFeedAddress, deployer]);

  // 4. ElemStaking (depende de ElemToken e PriceFeed)
  const elemStaking = m.contract("ElemStaking", [elemToken, priceFeed, deployer]);

  // 5. ElemDAO (depende de ElemToken)
  const elemDAO = m.contract("ElemDAO", [elemToken, deployer]);

  return { elemToken, elemNFT, priceFeed, elemStaking, elemDAO };
});
