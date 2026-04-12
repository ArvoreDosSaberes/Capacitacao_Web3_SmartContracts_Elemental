![visitors](https://visitor-badge.laobi.icu/badge?page_id=ArvoreDosSaberes.Capacitacao_Web3_SmartContracts_Elemental)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg?style=flat-square)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Last Commit](https://img.shields.io/github/last-commit/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental?style=flat-square)](https://github.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental/commits/main)
[![Stars](https://img.shields.io/github/stars/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental?style=flat-square)](https://github.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental/stargazers)
[![Forks](https://img.shields.io/github/forks/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental?style=flat-square)](https://github.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental/network/members)
[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?logo=solidity)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![Chainlink](https://img.shields.io/badge/Chainlink-Oracle-375BD2?logo=chainlink)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)
![Repository Size](https://img.shields.io/github/repo-size/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:d97706,50:ea580c,100:92400e&height=220&section=header&text=Elemental%20Protocol&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=MVP%20Web3%20Completo%20com%20Smart%20Contracts&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Elemental Protocol Header"/>
</p>

# Elemental Protocol - MVP Web3 Completo

![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?logo=solidity)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![Chainlink](https://img.shields.io/badge/Chainlink-Oracle-375BD2?logo=chainlink)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)
![Repository Size](https://img.shields.io/github/repo-size/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)

Protocolo descentralizado que combina Token ERC-20, NFT ERC-721 (pixel art), Staking com recompensas ajustadas por oráculo Chainlink, e DAO simplificada — deployado em testnet Ethereum (Sepolia).

## Prazo de Entrega: *12 de abril de 2026 23:59*

## Arquitetura

```text
contracts/
├── ElemToken.sol      – Token ERC-20 (ELEM) – OpenZeppelin
├── ElemNFT.sol        – NFT ERC-721 (Elemental Creatures) – 10 pixel arts
├── ElemStaking.sol    – Staking com recompensas dinâmicas (oráculo)
├── ElemDAO.sol        – Governança simplificada (criar/votar propostas)
└── PriceFeed.sol      – Wrapper Chainlink ETH/USD

ui/                    – Interface web (HTML + ethers.js puro)
NFT/                   – 10 GIFs pixel art para NFTs
ui/imgs/nft/           – Thumbnails dos NFTs para o FrontEnd
scripts/               – Scripts de deploy e geração de NFTs
docs/                  – Documentação e enunciado original
```

## Contratos Deployados (Sepolia)

| Contrato    | Endereço | Explorer |
| ----------- | --------- | -------- |
| ElemToken   | `0x...` | [link]()    |
| ElemNFT     | `0x...` | [link]()    |
| ElemStaking | `0x...` | [link]()    |
| ElemDAO     | `0x...` | [link]()    |
| PriceFeed   | `0x...` | [link]()    |

> Atualizar após deploy.

## Pré-requisitos

- Node.js >= 18
- MetaMask
- ETH de testnet Sepolia ([faucet](https://sepoliafaucet.com/))

## Setup com Hardhat

```bash
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts @chainlink/contracts
npx hardhat init
```

Copie os contratos de `contracts/` para `contracts/` do projeto Hardhat.

## Compilar

```bash
npx hardhat compile
```

## Deploy em Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Após o deploy, atualize os endereços em `ui/js/app.js` (objeto `ADDRESSES`).

## Usando com Remix IDE

1. Abra [Remix IDE](https://remix.ethereum.org)
2. Importe os arquivos `.sol` de `contracts/`
3. Compile com Solidity ^0.8.20
4. Conecte MetaMask (Sepolia) via "Injected Provider"
5. Deploy cada contrato na ordem: ElemToken → ElemNFT → PriceFeed → ElemStaking → ElemDAO

## Interface Web

```bash
# Servir localmente (qualquer servidor estático)
cd ui
python3 -m http.server 8080
# Abrir http://localhost:8080
```

### Funcionalidades da UI

- Conectar carteira MetaMask
- Visualizar saldo ELEM, ETH e NFTs
- Mint de NFTs (pixel art animado)
- Stake / Unstake de ELEM
- Claim de recompensas
- Criar e votar em propostas da DAO
- Consultar preço ETH/USD do oráculo

## Segurança

- ReentrancyGuard em operações de staking
- Controle de acesso (Ownable) em funções administrativas
- Solidity ^0.8.20 (proteção nativa contra overflow)
- Pausável (ElemToken) para emergências

### Auditoria

```bash
# Instalar dependências Python do projeto (Slither + utilitários compartilhados)
bash scripts/setup-python-venv.sh

# Slither (executa a análise a partir da raiz do projeto)
npm run audit:slither

# Mythril (ambiente separado)
bash scripts/setup-mythril-venv.sh
npm run audit:mythril -- contracts/ElemStaking.sol --solv 0.8.20
```

## Licença

Este projeto está licenciado sob a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:92400e,50:ea580c,100:d97706&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Protocolo Web3 completo com Token ERC-20, NFT ERC-721, Staking e DAO para capacitação em Smart Contracts
**Data de Criação:** 2025-04-11
**Autor:** Carlos Delfino
**Versão:** 1.0
**Última Atualização:** 2025-04-11
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2025-04-11 - Criado por Carlos Delfino - Versão 1.0
- 2025-04-11 - Atualizado por Carlos Delfino - Adicionado header e footer animados com cores laranja/marrom - Versão 1.1
