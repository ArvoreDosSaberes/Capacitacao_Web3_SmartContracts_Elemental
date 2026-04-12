![visitors](https://visitor-badge.laobi.icu/badge?page_id=ArvoreDosSaberes.Capacitacao_Web3_SmartContracts_Elemental.contracts)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-Framework-orange)
![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Elemental%20Protocol-green)
![Status](https://img.shields.io/badge/Status-Deployed-brightgreen)
![Repository Size](https://img.shields.io/github/repo-size/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)
![Last Commit](https://img.shields.io/github/last-commit/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:d97706,50:ea580c,100:92400e&height=220&section=header&text=Elemental%20Protocol%20Contracts&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Smart%20Contracts%20Deployed%20on%20Sepolia%20Testnet&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Elemental Protocol Contracts Header"/>
</p>

# Contratos do Elemental Protocol

Este diretório contém os smart contracts do projeto Elemental Protocol, um sistema completo de Web3 que inclui tokens, NFTs, staking e governança.

## Endereços dos Contratos (Sepolia Testnet)

### Contratos Principais

| Contrato | Endereço | Descrição |
|----------|-----------|-----------|
| **ElemToken** | `0xd8347173AF4D69Ae63ECfE4FF73C12fE349ed44e` | Token ERC-20 principal do protocolo |
| **ElemNFT** | `0x25e814A250a3C6a576e1F8e766328CC3C5B4fF89` | NFTs representando os elementos da natureza |
| **PriceFeed** | `0x3e59BfD48799217eA7c1b5cCE25b920C6E791fcC` | Wrapper para Chainlink Price Feed (ETH/USD) |
| **ElemStaking** | `0xd20379FA2B0c4F787983A72895707789e395AC06` | Contrato de staking com recompensas dinâmicas |
| **ElemDAO** | `0x585e25acf2200aDA4736CdCd9F3128fA072f615D` | DAO para governança do protocolo |

### Contratos de Suporte

| Contrato | Endereço | Descrição |
|----------|-----------|-----------|
| **MockAggregator** | `0x1213CF45bE0811a4fac2A72c30F3649710B6764b` | Mock do Chainlink Aggregator para testes |

## Estrutura dos Contratos

### Core Contracts

- **`ElemToken.sol`** - Token ERC-20 com funcionalidades avançadas
- **`ElemNFT.sol`** - NFTs ERC-721 com metadados IPFS
- **`ElemStaking.sol`** - Sistema de staking com recompensas baseadas em preço
- **`ElemDAO.sol`** - Organização Autônoma Descentralizada
- **`PriceFeed.sol`** - Oracle de preços Chainlink

### Mock Contracts

- **`mocks/MockAggregator.sol`** - Mock para testes locais

## Funcionalidades

### ElemToken
- **Total Supply**: 1,000,000 tokens
- **Decimals**: 18
- **Owner**: 0xcEF96AEee7322F10e3024cbCb7b3b9388d965392

### ElemNFT
- **Max Supply**: 10,000 NFTs
- **Mint Price**: 0.01 ETH
- **IPFS Integration**: Metadados armazenados em IPFS

### ElemStaking
- **APY Base**: 10% anual
- **Bonus Multiplier**: Até 2x baseado no preço do ETH
- **Lock Period**: Mínimo 7 dias

### ElemDAO
- **Governance**: Voting power baseado em holdings de ElemToken
- **Quorum**: 51% para aprovação de propostas
- **Timelock**: 24 horas para execução

## Deploy Information

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Deployer**: 0xcEF96AEee7322F10e3024cbCb7b3b9388d965392
- **Deploy Date**: 2026-04-12
- **Gas Used**: ~2,500,000 gas total

## Verificação

Todos os contratos foram verificados no Etherscan Sepolia:
- [ElemToken](https://sepolia.etherscan.io/address/0xd8347173AF4D69Ae63ECfE4FF73C12fE349ed44e)
- [ElemNFT](https://sepolia.etherscan.io/address/0x25e814A250a3C6a576e1F8e766328CC3C5B4fF89)
- [PriceFeed](https://sepolia.etherscan.io/address/0x3e59BfD48799217eA7c1b5cCE25b920C6E791fcC)
- [ElemStaking](https://sepolia.etherscan.io/address/0xd20379FA2B0c4F787983A72895707789e395AC06)
- [ElemDAO](https://sepolia.etherscan.io/address/0x585e25acf2200aDA4736CdCd9F3128fA072f615D)

## Como Interagir

### Via Hardhat
```bash
npx hardhat console --network sepolia
```

### Via Ethers.js
```javascript
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
const contract = new ethers.Contract(address, abi, provider);
```

### Via Web3.js
```javascript
const Web3 = require("web3");
const web3 = new Web3("https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
const contract = new web3.eth.Contract(abi, address);
```

## Dependências

- **OpenZeppelin Contracts**: v5.6.1
- **Chainlink Contracts**: v1.5.0
- **Solidity**: v0.8.27

## Licença

Este projeto está licenciado sob Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:92400e,50:ea580c,100:d97706&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Documentação completa dos contratos do Elemental Protocol com endereços deployados na Sepolia Testnet e informações de interação.
**Data de Criação:** 2026-04-12
**Autor:** Sistema de Deploy Automático
**Versão:** 1.0
**Última Atualização:** 2026-04-12
**Atualizado por:** Sistema de Deploy Automático
**Histórico de Alterações:**
- 2026-04-12 - Criado por Sistema de Deploy Automático - Deploy inicial dos contratos na Sepolia - Versão 1.0
