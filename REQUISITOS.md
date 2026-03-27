[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_REQUISITOS.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_REQUISITOS)

# REQUISITOS – Protocolo Web3 Completo (MVP)

## Visão Geral

Protocolo descentralizado que combina um **token ERC-20**, uma **coleção NFT ERC-721** (pixel art), **staking com recompensas** ajustadas por oráculo, e uma **DAO simplificada** para governança — tudo deployado em testnet Ethereum (Sepolia).

---

## 1. Problema que o Protocolo Resolve

Criar um ecossistema gamificado onde:

- Usuários adquirem **NFTs** (criaturas pixel art) que representam participação no protocolo.
- O **token ERC-20** (`ELEM`) serve como moeda de utilidade: staking, recompensas e votação.
- **Staking** de tokens `ELEM` gera recompensas proporcionais, com taxa ajustada dinamicamente pelo preço ETH/USD via oráculo Chainlink.
- A **DAO** permite que holders de `ELEM` votem em propostas simples de governança.

---

## 2. Contratos Inteligentes

### 2.1 Token ERC-20 – `ElemToken.sol`

- **Padrão:** ERC-20 (OpenZeppelin)
- **Nome:** Elemental Token
- **Símbolo:** ELEM
- **Supply inicial:** 1.000.000 ELEM
- **Funcionalidades:**
  - Mint (restrito ao owner / contrato de staking)
  - Burn
  - Pausável (emergência)

### 2.2 NFT ERC-721 – `ElemNFT.sol`

- **Padrão:** ERC-721 (OpenZeppelin)
- **Nome:** Elemental Creatures
- **Símbolo:** ECRAFT
- **Supply máximo:** 10 NFTs (coleção fixa — pixel art na pasta `NFT/`)
- **Funcionalidades:**
  - Mint público (preço em ELEM ou ETH)
  - Metadata URI (on-chain ou IPFS)
  - Enumerável

### 2.3 Staking – `ElemStaking.sol`

- **Funcionalidades:**
  - Stake de tokens ELEM
  - Withdraw de tokens ELEM
  - Claim de recompensas
  - Taxa de recompensa ajustada por oráculo (preço ETH/USD)
- **Segurança:**
  - ReentrancyGuard (OpenZeppelin)
  - Controle de acesso (Ownable)

### 2.4 Governança (DAO) – `ElemDAO.sol`

- **Funcionalidades:**
  - Criar proposta (texto + ação)
  - Votar (a favor / contra) — peso proporcional ao saldo ELEM
  - Executar proposta aprovada (quórum mínimo)
  - Período de votação configurável
- **Segurança:**
  - Snapshot de saldos para evitar manipulação

### 2.5 Oráculo – `PriceFeed.sol`

- **Integração:** Chainlink Price Feed (ETH/USD)
- **Uso:** Contrato de staking consulta preço para ajustar taxa de recompensa
- **Fallback:** Taxa fixa caso o oráculo falhe

---

## 3. Arquitetura do Projeto

```text
Smartcontracts/
├── contracts/            # Contratos Solidity (estrutura Remix)
│   ├── ElemToken.sol
│   ├── ElemNFT.sol
│   ├── ElemStaking.sol
│   ├── ElemDAO.sol
│   └── PriceFeed.sol
├── scripts/              # Scripts de deploy e utilidades
│   ├── deploy.js
│   └── generate_nfts.py
├── tests/                # Testes dos contratos
│   └── ...
├── ui/                   # Interface Web (HTML + ethers.js puro)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── ethers.min.js
│   │   └── abi/
│   │       ├── ElemToken.json
│   │       ├── ElemNFT.json
│   │       ├── ElemStaking.json
│   │       └── ElemDAO.json
│   └── assets/
├── NFT/                  # GIFs pixel art para NFTs
│   ├── nft_01_fire_elemental.gif
│   ├── ...
│   └── nft_10_magma_core.gif
├── ui/imgs/nft/          # Thumbnails dos NFTs para o FrontEnd
│   ├── nft_01_fire_elemental_thumb.png
│   ├── ...
│   └── nft_10_magma_core_thumb.png
├── docs/                 # Documentação e PDF original
│   ├── Nível Avançado - ... .pdf
│   └── Nível Avançado - ... .md
├── REQUISITOS.md         # Este arquivo
└── README.md             # Instruções de uso e deploy
```

---

## 4. Interface Web (`ui/`)

- **Stack:** HTML5 + CSS3 + JavaScript vanilla + **ethers.js**
- **Funcionalidades da UI:**
  - Conectar carteira MetaMask
  - Exibir saldo ELEM e NFTs do usuário
  - Mint de NFT (visualizando GIF pixel art)
  - Stake / Unstake de ELEM
  - Claim de recompensas
  - Criar e votar em propostas da DAO
  - Exibir preço ETH/USD do oráculo

---

## 5. Segurança

- [ ] Proteção contra reentrancy (ReentrancyGuard)
- [ ] Controle de acesso (Ownable / AccessControl)
- [ ] Solidity ^0.8.x (overflow/underflow nativo)
- [ ] Auditoria com Slither
- [ ] Auditoria com Mythril
- [ ] Testes com Hardhat
- [ ] Relatório de auditoria

---

## 6. Deploy

- **Testnet:** Sepolia
- **Ferramentas:** Remix IDE / Hardhat
- **Entregáveis:**
  - Endereço de cada contrato deployado
  - Links do Etherscan (Sepolia)
  - README explicativo

---

## 7. Critérios de Avaliação

| Critério                  | Peso |
|---------------------------|------|
| Arquitetura e Modelagem   | 20%  |
| Implementação Técnica     | 20%  |
| Segurança                 | 20%  |
| Integração Oráculo        | 10%  |
| Integração Web3           | 10%  |
| Deploy em Testnet         | 10%  |
| Clareza do Relatório      | 10%  |

---

## 8. Roadmap de Desenvolvimento

- [ ] **Fase 1:** Modelagem e arquitetura (este documento)
- [ ] **Fase 2:** Implementação dos contratos (ElemToken → ElemNFT → ElemStaking → PriceFeed → ElemDAO)
- [ ] **Fase 3:** Testes unitários e de integração
- [ ] **Fase 4:** Auditoria de segurança
- [ ] **Fase 5:** Interface Web (ui/)
- [ ] **Fase 6:** Deploy em Sepolia
- [ ] **Fase 7:** Documentação final e vídeo demonstrativo
