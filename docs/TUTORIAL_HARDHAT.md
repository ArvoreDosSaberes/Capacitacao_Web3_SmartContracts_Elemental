[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_HARDHAT.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_HARDHAT)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Hardhat](https://img.shields.io/badge/Hardhat-v3.x-FFF100?logo=hardhat)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?logo=solidity)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![Status](https://img.shields.io/badge/Status-Deploy-brightgreen)

# Tutorial Hardhat — Elemental Protocol

## Guia Passo a Passo para Compilar, Testar e Deployar os Contratos

> **Projeto:** Elemental Protocol
> **Hardhat:** v3.x (com TypeScript + viem)
> **Solidity:** ^0.8.20 / 0.8.28
> **Rede-alvo:** Sepolia (testnet Ethereum)

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Instalação e Configuração Inicial](#3-instalação-e-configuração-inicial)
4. [Entendendo o hardhat.config.ts](#4-entendendo-o-hardhatconfigts)
5. [Compilando os Contratos](#5-compilando-os-contratos)
6. [Executando um Nó Local](#6-executando-um-nó-local)
7. [Escrevendo e Executando Testes](#7-escrevendo-e-executando-testes)
8. [Deploy Local com Hardhat Ignition](#8-deploy-local-com-hardhat-ignition)
9. [Deploy em Sepolia (Testnet)](#9-deploy-em-sepolia-testnet)
10. [Interagindo com os Contratos pelo Console](#10-interagindo-com-os-contratos-pelo-console)
11. [Verificando Contratos no Etherscan](#11-verificando-contratos-no-etherscan)
12. [Problemas Comuns e Soluções](#12-problemas-comuns-e-soluções)
13. [Resumo dos Comandos](#13-resumo-dos-comandos)

---

## 1. Visão Geral

### O que é o Hardhat?

O **Hardhat** é um ambiente de desenvolvimento para smart contracts Ethereum. Ele permite:

- **Compilar** contratos Solidity
- **Testar** com frameworks de teste (node test runner, mocha)
- **Deployar** em redes locais ou testnets
- **Depurar** transações com stack traces detalhados
- **Simular** uma blockchain local (Hardhat Network)

### Hardhat 3 vs Hardhat 2

Este projeto utiliza o **Hardhat 3** (`^3.2.0`), que traz mudanças significativas em relação ao Hardhat 2:

| Aspecto | Hardhat 2 | Hardhat 3 |
|---------|-----------|-----------|
| Configuração | `hardhat.config.js` com `require()` | `hardhat.config.ts` com `defineConfig()` |
| Linguagem | JavaScript ou TypeScript | TypeScript nativo (ESM) |
| Biblioteca Web3 | ethers.js (plugin) | **viem** (nativo via toolbox-viem) |
| Deploy | Scripts manuais ou Ignition | **Hardhat Ignition** (recomendado) |
| Variáveis sensíveis | dotenv / .env | `configVariable()` (nativo) |
| Redes simuladas | `type: "hardhat"` | `type: "edr-simulated"` |
| Package type | CommonJS | **ESM** (`"type": "module"`) |

> **Atenção:** Muitos tutoriais na internet ainda usam Hardhat 2. Se você copiar código de exemplos antigos (ex: `require("hardhat")`, `ethers.utils`, `contract.deployed()`), eles **não funcionarão** diretamente neste projeto.

### Estrutura do Projeto

```text
Smartcontracts/
├── contracts/               ← Contratos Solidity
│   ├── ElemToken.sol        (ERC-20)
│   ├── ElemNFT.sol          (ERC-721)
│   ├── ElemStaking.sol      (Staking com oráculo)
│   ├── ElemDAO.sol          (Governança)
│   └── PriceFeed.sol        (Wrapper Chainlink)
├── ignition/modules/        ← Módulos Hardhat Ignition (deploy)
│   └── ElementalProtocol.ts (a ser criado neste tutorial)
├── tests/                   ← Testes dos contratos
├── scripts/                 ← Scripts auxiliares
│   └── deploy.js            (script legado — ver nota abaixo)
├── hardhat.config.ts        ← Configuração do Hardhat 3
├── package.json             ← Dependências Node.js
└── node_modules/            ← Pacotes instalados
```

---

## 2. Pré-requisitos

### 2.1 Software necessário

| Software | Versão mínima | Verificar instalação | Instalação |
|----------|--------------|---------------------|------------|
| **Node.js** | >= 18 | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | >= 9 | `npm --version` | Incluído com Node.js |
| **Git** | >= 2.x | `git --version` | [git-scm.com](https://git-scm.com) |
| **MetaMask** | Extensão | Navegador | [metamask.io](https://metamask.io) |

### 2.2 Conhecimentos recomendados

- JavaScript / TypeScript básico
- Conceitos de blockchain (transações, gas, wallets)
- Solidity básico (variáveis, funções, modificadores)

### 2.3 ETH de testnet

Você precisará de ETH na rede **Sepolia** para fazer deploy. Obtenha gratuitamente em um faucet:

- [sepoliafaucet.com](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

---

## 3. Instalação e Configuração Inicial

### 3.1 Clonar o repositório (se ainda não fez)

```bash
git clone git@github.com:ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental.git
cd Capacitacao_Web3_SmartContracts_Elemental
```

### 3.2 Instalar dependências

```bash
npm install
```

Isso instala todas as dependências listadas no `package.json`:

- **hardhat** `^3.2.0` — Framework principal
- **@nomicfoundation/hardhat-toolbox-viem** — Plugin com viem, testes, cobertura, ignition
- **@nomicfoundation/hardhat-ignition** — Sistema de deploy declarativo
- **@openzeppelin/contracts** `^5.6.1` — Contratos padrão auditados (ERC-20, ERC-721, etc.)
- **@chainlink/contracts** `^1.5.0` — Interfaces do oráculo Chainlink
- **typescript** `~5.8.0` — Compilador TypeScript
- **viem** `^2.47.6` — Biblioteca de interação com Ethereum (substitui ethers.js)

### 3.3 Verificar se o Hardhat funciona

```bash
npx hardhat --version
```

Saída esperada (algo como):

```
Hardhat version 3.2.0
```

Se der erro, verifique se o `npm install` completou sem erros.

### 3.4 Listar tarefas disponíveis

```bash
npx hardhat --help
```

Você verá as tarefas (tasks) disponíveis como `compile`, `test`, `node`, `ignition`, etc.

---

## 4. Entendendo o hardhat.config.ts

O arquivo `hardhat.config.ts` é o **coração** da configuração do Hardhat. Vamos analisá-lo:

```typescript
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
```

### Explicação de cada seção

#### `plugins`

```typescript
plugins: [hardhatToolboxViemPlugin],
```

Carrega o plugin `hardhat-toolbox-viem` que inclui:
- **viem** para interagir com contratos
- **Hardhat Ignition** para deploy
- **solidity-coverage** para cobertura de testes
- **hardhat-verify** para verificar contratos no Etherscan

#### `solidity.profiles`

```typescript
solidity: {
  profiles: {
    default: { version: "0.8.28" },
    production: {
      version: "0.8.28",
      settings: { optimizer: { enabled: true, runs: 200 } },
    },
  },
},
```

- **default** — Compilação rápida para desenvolvimento (sem otimizador).
- **production** — Compilação otimizada para deploy (reduz gas).

Para compilar em modo produção:

```bash
npx hardhat compile --profile production
```

> **Nota:** Os contratos usam `pragma solidity ^0.8.20`, que é compatível com o compilador `0.8.28` configurado (o `^` significa "0.8.20 ou superior dentro da mesma minor").

#### `networks`

```typescript
networks: {
  hardhatMainnet: {
    type: "edr-simulated",  // Rede local simulada
    chainType: "l1",
  },
  sepolia: {
    type: "http",           // Rede real via RPC
    chainType: "l1",
    url: configVariable("SEPOLIA_RPC_URL"),
    accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
  },
},
```

- **`edr-simulated`** — Rede local do Hardhat (rápida, sem gas real).
- **`http`** — Conexão com rede real (Sepolia, mainnet, etc.).
- **`configVariable()`** — Busca variáveis sensíveis de forma segura (sem expor no código).

### Configurando variáveis sensíveis (Hardhat 3)

No Hardhat 3, **não** se usa `.env` + `dotenv`. Em vez disso, o Hardhat possui um sistema nativo de variáveis de configuração.

Para definir as variáveis, use o comando:

```bash
# Definir a URL do RPC (ex: Infura ou Alchemy)
npx hardhat keystore set SEPOLIA_RPC_URL

# Definir a chave privada da sua carteira
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

O Hardhat pedirá o valor de forma interativa (não aparece no terminal). Os valores são armazenados de forma **criptografada** no keystore local.

> **Como obter o RPC URL:**
> 1. Crie uma conta gratuita em [Infura](https://infura.io) ou [Alchemy](https://alchemy.com).
> 2. Crie um projeto/app para a rede Sepolia.
> 3. Copie a URL do endpoint (ex: `https://sepolia.infura.io/v3/SUA_API_KEY`).
>
> **Como obter a chave privada:**
> 1. Abra o MetaMask.
> 2. Clique nos 3 pontos → "Detalhes da conta" → "Exportar chave privada".
> 3. **NUNCA** compartilhe esta chave ou a coloque em código-fonte!

---

## 5. Compilando os Contratos

### 5.1 Compilar

```bash
npx hardhat compile
```

**Saída esperada:**

```
Compiling 5 Solidity files
Successfully compiled 5 Solidity files
```

Se houver erros de compilação, o Hardhat mostrará a linha e o arquivo com problema.

### 5.2 O que acontece ao compilar?

O Hardhat gera os **artefatos** (ABI + bytecode) na pasta `artifacts/`:

```text
artifacts/
└── contracts/
    ├── ElemToken.sol/
    │   └── ElemToken.json    ← ABI + bytecode
    ├── ElemNFT.sol/
    │   └── ElemNFT.json
    ├── ElemStaking.sol/
    │   └── ElemStaking.json
    ├── ElemDAO.sol/
    │   └── ElemDAO.json
    └── PriceFeed.sol/
        └── PriceFeed.json
```

O **ABI** (Application Binary Interface) é o que permite que código JavaScript/TypeScript (e a UI) interajam com os contratos. Cada arquivo `.json` contém:
- `abi` — Definição de funções, eventos e erros do contrato.
- `bytecode` — Código compilado para deploy na EVM.

### 5.3 Forçar recompilação

```bash
npx hardhat compile --force
```

Útil quando você altera dependências ou quer garantir uma compilação limpa.

### 5.4 Limpar artefatos

```bash
npx hardhat clean
```

Remove toda a pasta `artifacts/` e `cache/`. Útil para resolver problemas de cache.

---

## 6. Executando um Nó Local

O Hardhat inclui uma blockchain local simulada (**Hardhat Network**) que é perfeita para desenvolvimento e testes.

### 6.1 Iniciar o nó

```bash
npx hardhat node
```

**Saída esperada:**

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

Account #0: 0xf39Fd6...  (10000 ETH)
Private Key: 0xac0974...

Account #1: 0x709979...  (10000 ETH)
Private Key: 0x59c6995...

...
```

O Hardhat cria **20 contas** pré-financiadas com 10.000 ETH cada (ETH fictício, apenas para testes).

### 6.2 Por que usar o nó local?

| Vantagem | Descrição |
|----------|-----------|
| **Velocidade** | Transações são instantâneas (sem esperar mineração). |
| **Gratuito** | Não gasta ETH real nem de testnet. |
| **Controle** | Pode manipular o tempo (`evm_increaseTime`), criar snapshots, etc. |
| **Depuração** | Stack traces completos quando uma transação falha. |
| **Reiniciável** | Cada vez que reinicia, o estado volta ao zero. |

### 6.3 Conectar MetaMask ao nó local

1. Abra o MetaMask.
2. Clique em "Redes" → "Adicionar rede manualmente".
3. Preencha:
   - **Nome:** Hardhat Local
   - **URL RPC:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Símbolo:** ETH
4. Importe uma das contas do nó usando a chave privada exibida no terminal.

> **Dica:** Após reiniciar o nó, se o MetaMask mostrar erros de nonce, vá em **Configurações Avançadas → Limpar dados de atividade** no MetaMask.

---

## 7. Escrevendo e Executando Testes

### 7.1 Estrutura de testes no Hardhat 3

No Hardhat 3, os testes usam o **Node.js test runner** nativo (ou mocha) com **viem** para interação com contratos.

Crie o arquivo `tests/ElemToken.test.ts`:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";

describe("ElemToken", function () {
  it("Deve deployar com o supply correto", async function () {
    // Obter contas do Hardhat Network
    const [owner] = await hre.network.provider.request({
      method: "eth_accounts",
    });

    // Deploy do contrato via viem
    const token = await hre.viem.deployContract("ElemToken", [owner]);

    // Verificar nome e símbolo
    const name = await token.read.name();
    assert.equal(name, "Elemental Token");

    const symbol = await token.read.symbol();
    assert.equal(symbol, "ELEM");

    // Verificar supply total (1.000.000 * 10^18)
    const totalSupply = await token.read.totalSupply();
    const expectedSupply = 1_000_000n * 10n ** 18n;
    assert.equal(totalSupply, expectedSupply);
  });

  it("Apenas o owner pode pausar", async function () {
    const [owner] = await hre.network.provider.request({
      method: "eth_accounts",
    });

    const token = await hre.viem.deployContract("ElemToken", [owner]);

    // O owner pode pausar
    await token.write.pause();
    const paused = await token.read.paused();
    assert.equal(paused, true);
  });

  it("Não permite mint além do MAX_SUPPLY", async function () {
    const [owner] = await hre.network.provider.request({
      method: "eth_accounts",
    });

    const token = await hre.viem.deployContract("ElemToken", [owner]);

    // Tentar mintar 1 token a mais deve falhar
    // (MAX_SUPPLY já foi mintado no constructor)
    try {
      await token.write.mint([owner, 1n]);
      assert.fail("Deveria ter revertido");
    } catch (error) {
      // Esperado: transação revertida
      assert.ok(true);
    }
  });
});
```

### 7.2 Executar testes

```bash
npx hardhat test
```

**Saída esperada:**

```
  ElemToken
    ✓ Deve deployar com o supply correto
    ✓ Apenas o owner pode pausar
    ✓ Não permite mint além do MAX_SUPPLY

  3 passing
```

### 7.3 Executar teste específico

```bash
# Por arquivo
npx hardhat test tests/ElemToken.test.ts

# Por nome do teste (grep)
npx hardhat test --grep "supply"
```

### 7.4 Testes com mais detalhes (verbose)

```bash
npx hardhat test --verbose
```

### 7.5 Conceitos-chave nos testes com viem

| Conceito | Código | Descrição |
|----------|--------|-----------|
| Deploy | `hre.viem.deployContract("NomeContrato", [args])` | Deploya um contrato e retorna a instância |
| Ler (view) | `contrato.read.funcao()` | Chama funções `view` / `pure` (sem gas) |
| Escrever | `contrato.write.funcao([args])` | Envia transação (gasta gas) |
| Eventos | `contrato.getEvents.NomeEvento()` | Lê eventos emitidos |
| Contas | `hre.viem.getWalletClients()` | Obtém wallets para simular diferentes usuários |

### 7.6 Exemplo de teste completo do ElemNFT

Crie `tests/ElemNFT.test.ts`:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { parseEther } from "viem";

describe("ElemNFT", function () {
  it("Deve permitir mint pagando ETH suficiente", async function () {
    const [owner] = await hre.network.provider.request({
      method: "eth_accounts",
    });

    const nft = await hre.viem.deployContract("ElemNFT", [owner]);

    // Mint pagando 0.01 ETH
    await nft.write.mint(["ipfs://test-uri"], {
      value: parseEther("0.01"),
    });

    // Verificar que o NFT foi mintado
    const totalSupply = await nft.read.totalSupply();
    assert.equal(totalSupply, 1n);

    // Verificar que o owner do NFT #0 é quem mintou
    const nftOwner = await nft.read.ownerOf([0n]);
    assert.equal(nftOwner.toLowerCase(), owner.toLowerCase());
  });

  it("Deve rejeitar mint com ETH insuficiente", async function () {
    const [owner] = await hre.network.provider.request({
      method: "eth_accounts",
    });

    const nft = await hre.viem.deployContract("ElemNFT", [owner]);

    try {
      await nft.write.mint(["ipfs://test-uri"], {
        value: parseEther("0.001"), // Menor que 0.01
      });
      assert.fail("Deveria ter revertido");
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Deve respeitar o MAX_SUPPLY de 10", async function () {
    const [owner] = await hre.network.provider.request({
      method: "eth_accounts",
    });

    const nft = await hre.viem.deployContract("ElemNFT", [owner]);

    // Mintar todos os 10 NFTs
    for (let i = 0; i < 10; i++) {
      await nft.write.mint([`ipfs://nft-${i}`], {
        value: parseEther("0.01"),
      });
    }

    // O 11º mint deve falhar
    try {
      await nft.write.mint(["ipfs://nft-extra"], {
        value: parseEther("0.01"),
      });
      assert.fail("Deveria ter revertido");
    } catch (error) {
      assert.ok(true);
    }
  });
});
```

---

## 8. Deploy Local com Hardhat Ignition

### 8.1 O que é Hardhat Ignition?

O **Hardhat Ignition** é o sistema de deploy **declarativo** do Hardhat 3. Em vez de escrever scripts imperativos (como o `scripts/deploy.js` legado), você declara **módulos** que descrevem quais contratos deployar e suas dependências.

Vantagens:
- **Idempotente** — Se um deploy falhar no meio, pode ser retomado de onde parou.
- **Declarativo** — Descreve *o quê* deployar, não *como*.
- **Rastreável** — Armazena histórico de deploys em `ignition/deployments/`.

### 8.2 Criar o módulo de deploy

> **Nota:** O arquivo `ignition/modules/Counter.ts` que veio com o projeto é um **placeholder** do template inicial do Hardhat. Vamos criar o módulo correto para o Elemental Protocol.

Crie o arquivo `ignition/modules/ElementalProtocol.ts`:

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Módulo Hardhat Ignition para o Elemental Protocol.
 *
 * Ordem de deploy:
 * 1. ElemToken   (sem dependências)
 * 2. ElemNFT     (sem dependências)
 * 3. PriceFeed   (depende do endereço Chainlink)
 * 4. ElemStaking (depende de ElemToken + PriceFeed)
 * 5. ElemDAO     (depende de ElemToken)
 */
export default buildModule("ElementalProtocol", (m) => {
  // Parâmetro: endereço do Chainlink ETH/USD
  // Sepolia: 0x694AA1769357215DE4FAC081bf1f309aDC325306
  // Para rede local, passe o endereço de um mock ou use o fallback do contrato
  const chainlinkFeed = m.getParameter(
    "chainlinkFeed",
    "0x694AA1769357215DE4FAC081bf1f309aDC325306"
  );

  // Parâmetro: endereço do owner (deployer)
  const owner = m.getAccount(0);

  // 1. Deploy ElemToken
  const elemToken = m.contract("ElemToken", [owner]);

  // 2. Deploy ElemNFT
  const elemNFT = m.contract("ElemNFT", [owner]);

  // 3. Deploy PriceFeed
  const priceFeed = m.contract("PriceFeed", [chainlinkFeed, owner]);

  // 4. Deploy ElemStaking (depende de ElemToken e PriceFeed)
  const elemStaking = m.contract("ElemStaking", [elemToken, priceFeed, owner]);

  // 5. Deploy ElemDAO (depende de ElemToken)
  const elemDAO = m.contract("ElemDAO", [elemToken, owner]);

  return { elemToken, elemNFT, priceFeed, elemStaking, elemDAO };
});
```

### 8.3 Deploy na rede local

Primeiro, inicie o nó local em um terminal separado:

```bash
# Terminal 1: Iniciar nó
npx hardhat node
```

Em outro terminal, execute o deploy:

```bash
# Terminal 2: Deploy via Ignition
npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network localhost
```

**Saída esperada:**

```
Deploying [ ElementalProtocol ]

Batch #1
  Deployed ElemToken - 0x5FbDB2315678afecb367f032d93F642f64180aa3
  Deployed ElemNFT - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

Batch #2
  Deployed PriceFeed - 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

Batch #3
  Deployed ElemStaking - 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
  Deployed ElemDAO - 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9

[ ElementalProtocol ] successfully deployed
```

Note como o Ignition resolve automaticamente as dependências:
- **Batch #1**: ElemToken e ElemNFT (sem dependências — deployados em paralelo).
- **Batch #2**: PriceFeed (precisa do endereço Chainlink).
- **Batch #3**: ElemStaking e ElemDAO (precisam dos endereços da Batch #1 e #2).

### 8.4 Histórico de deploys

Após o deploy, o Ignition cria registros em:

```text
ignition/deployments/
└── chain-31337/           ← Chain ID da rede local
    ├── deployed_addresses.json
    └── journal.jsonl
```

O `deployed_addresses.json` contém os endereços deployados:

```json
{
  "ElementalProtocol#ElemToken": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "ElementalProtocol#ElemNFT": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "ElementalProtocol#PriceFeed": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "ElementalProtocol#ElemStaking": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  "ElementalProtocol#ElemDAO": "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
}
```

---

## 9. Deploy em Sepolia (Testnet)

### 9.1 Pré-requisitos para Sepolia

Antes de deployar em Sepolia, certifique-se de ter:

1. **ETH de testnet** na sua carteira (pelo menos 0.05 ETH).
2. **URL do RPC** de um provedor (Infura ou Alchemy).
3. **Chave privada** da carteira que fará o deploy.

### 9.2 Configurar as variáveis no keystore

```bash
# Definir URL do RPC Sepolia
npx hardhat keystore set SEPOLIA_RPC_URL
# Cole: https://sepolia.infura.io/v3/SUA_API_KEY  (Enter)

# Definir chave privada
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
# Cole sua chave privada (Enter)
```

> **Segurança:** Esses valores ficam criptografados no keystore do Hardhat. Nunca coloque chaves privadas em arquivos de código!

### 9.3 Verificar saldo

Antes do deploy, confirme que tem ETH suficiente:

1. Abra [sepolia.etherscan.io](https://sepolia.etherscan.io).
2. Cole o endereço da sua carteira.
3. Verifique se tem pelo menos 0.05 ETH.

### 9.4 Executar o deploy

```bash
npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia
```

O Hardhat irá:

1. Compilar os contratos (se necessário).
2. Conectar à rede Sepolia via RPC.
3. Deployar os contratos em batches (respeitando dependências).
4. Aguardar confirmações de cada transação.

> **Tempo estimado:** 2–5 minutos (depende do congestionamento da rede).

### 9.5 Anotar os endereços

Após o deploy, copie os endereços exibidos e:

1. **Atualize o `README.md`** — Tabela de contratos deployados.
2. **Atualize `ui/js/app.js`** — Objeto `ADDRESSES` no topo do arquivo.

```javascript
const ADDRESSES = {
    ElemToken:   "0x_ENDEREÇO_REAL_AQUI_",
    ElemNFT:     "0x_ENDEREÇO_REAL_AQUI_",
    ElemStaking: "0x_ENDEREÇO_REAL_AQUI_",
    ElemDAO:     "0x_ENDEREÇO_REAL_AQUI_",
    PriceFeed:   "0x_ENDEREÇO_REAL_AQUI_",
};
```

---

## 10. Interagindo com os Contratos pelo Console

O Hardhat oferece um console interativo para testar chamadas aos contratos diretamente.

### 10.1 Abrir o console (rede local)

Certifique-se de que o nó local está rodando (`npx hardhat node`) e execute:

```bash
npx hardhat console --network localhost
```

### 10.2 Exemplos de interação

No console interativo, você pode usar viem para interagir com os contratos:

```typescript
// Obter instância do contrato deployado
const token = await hre.viem.getContractAt(
  "ElemToken",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3" // endereço do deploy
);

// Ler o nome do token
const name = await token.read.name();
console.log("Nome:", name);
// → "Elemental Token"

// Ler o supply total
const supply = await token.read.totalSupply();
console.log("Supply:", supply);
// → 1000000000000000000000000n (1M * 10^18)

// Verificar saldo de uma conta
const [owner] = await hre.viem.getWalletClients();
const balance = await token.read.balanceOf([owner.account.address]);
console.log("Saldo:", balance);
```

### 10.3 Console na rede Sepolia

```bash
npx hardhat console --network sepolia
```

> Funciona da mesma forma, mas as transações de escrita custam gas real (de testnet).

---

## 11. Verificando Contratos no Etherscan

Verificar contratos no Etherscan permite que qualquer pessoa leia o código-fonte diretamente no explorer.

### 11.1 Obter API Key do Etherscan

1. Crie uma conta em [etherscan.io](https://etherscan.io).
2. Vá em "API Keys" → "Add".
3. Copie a chave gerada.

### 11.2 Configurar a API Key

```bash
npx hardhat keystore set ETHERSCAN_API_KEY
```

Para que o Hardhat use essa chave, adicione ao `hardhat.config.ts`:

```typescript
// Adicionar na configuração, após networks:
etherscan: {
  apiKey: configVariable("ETHERSCAN_API_KEY"),
},
```

### 11.3 Verificar um contrato

```bash
npx hardhat verify --network sepolia ENDEREÇO_DO_CONTRATO "arg1" "arg2"
```

**Exemplo — verificar ElemToken:**

```bash
npx hardhat verify --network sepolia 0xSEU_ENDEREÇO_ELEMTOKEN "0xSEU_ENDEREÇO_OWNER"
```

**Exemplo — verificar ElemStaking (3 argumentos no constructor):**

```bash
npx hardhat verify --network sepolia 0xSEU_ENDEREÇO_STAKING \
  "0xENDEREÇO_ELEMTOKEN" \
  "0xENDEREÇO_PRICEFEED" \
  "0xENDEREÇO_OWNER"
```

Após a verificação, o código-fonte aparecerá com um ✅ verde no Etherscan.

---

## 12. Problemas Comuns e Soluções

### Problema 1: "Cannot find module" ou erros de import

**Causa:** Dependências não instaladas ou cache corrompido.

```bash
# Solução:
rm -rf node_modules
npm install
npx hardhat clean
npx hardhat compile
```

### Problema 2: "Error: Nothing to compile"

**Causa:** Contratos já estão compilados e em cache.

```bash
# Solução:
npx hardhat compile --force
```

### Problema 3: O script `deploy.js` não funciona

**Causa:** O arquivo `scripts/deploy.js` usa padrões do **Hardhat 2** (`require("hardhat")`, `ethers.utils`, `contract.deployed()`). No Hardhat 3, o método recomendado é usar **Hardhat Ignition** (seção 8 deste tutorial).

> O `deploy.js` existente é um **arquivo de referência** para entender a lógica de deploy. Para executar deploys, use o módulo Ignition criado na seção 8.

### Problema 4: "ProviderError: nonce too high"

**Causa:** O MetaMask tem um nonce em cache diferente do nó local (acontece ao reiniciar o nó).

```
Solução no MetaMask:
Configurações → Avançado → Limpar dados de atividade
```

### Problema 5: "Insufficient funds for gas"

**Causa:** A conta não tem ETH suficiente.

- **Rede local:** Reinicie o nó (`npx hardhat node`) — as contas voltam com 10.000 ETH.
- **Sepolia:** Use um faucet para obter mais ETH de testnet.

### Problema 6: Compilação falha com erros nos contratos OpenZeppelin/Chainlink

**Causa:** Versões incompatíveis das dependências.

```bash
# Verificar versões instaladas
npm ls @openzeppelin/contracts
npm ls @chainlink/contracts

# Reinstalar versões corretas
npm install @openzeppelin/contracts@^5.6.1 @chainlink/contracts@^1.5.0
```

### Problema 7: "hardhat keystore" não reconhecido

**Causa:** Versão antiga do Hardhat ou configuração incorreta.

```bash
# Verificar versão
npx hardhat --version

# Deve ser >= 3.0.0. Se não for:
npm install --save-dev hardhat@latest
```

### Problema 8: Testes falham com "contract not found"

**Causa:** Contratos não compilados antes de rodar os testes.

```bash
# O Hardhat compila automaticamente, mas se persistir:
npx hardhat clean
npx hardhat compile
npx hardhat test
```

---

## 13. Resumo dos Comandos

### Comandos do dia a dia

| Comando | Descrição |
|---------|-----------|
| `npx hardhat compile` | Compilar todos os contratos |
| `npx hardhat compile --force` | Forçar recompilação |
| `npx hardhat clean` | Limpar artefatos e cache |
| `npx hardhat test` | Executar todos os testes |
| `npx hardhat test tests/arquivo.test.ts` | Executar teste específico |
| `npx hardhat node` | Iniciar nó local |
| `npx hardhat console --network localhost` | Console interativo (local) |

### Comandos de deploy

| Comando | Descrição |
|---------|-----------|
| `npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network localhost` | Deploy na rede local |
| `npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia` | Deploy em Sepolia |

### Comandos de configuração

| Comando | Descrição |
|---------|-----------|
| `npx hardhat keystore set NOME_VARIAVEL` | Definir variável sensível |
| `npx hardhat keystore delete NOME_VARIAVEL` | Remover variável |
| `npx hardhat keystore list` | Listar variáveis definidas |

### Comandos de verificação

| Comando | Descrição |
|---------|-----------|
| `npx hardhat verify --network sepolia ENDEREÇO "arg1" "arg2"` | Verificar contrato no Etherscan |

---

## Fluxo Completo Resumido

```text
1. npm install                          ← Instalar dependências
2. npx hardhat compile                  ← Compilar contratos
3. npx hardhat test                     ← Rodar testes
4. npx hardhat node                     ← (Terminal 1) Iniciar nó local
5. npx hardhat ignition deploy ... --network localhost  ← (Terminal 2) Deploy local
6. Testar via console ou UI conectada ao localhost
7. npx hardhat keystore set SEPOLIA_RPC_URL     ← Configurar Sepolia
8. npx hardhat keystore set SEPOLIA_PRIVATE_KEY
9. npx hardhat ignition deploy ... --network sepolia    ← Deploy em Sepolia
10. Atualizar endereços em ui/js/app.js
11. npx hardhat verify ...              ← Verificar no Etherscan
```

---

## Referências

- [Hardhat 3 — Documentação Oficial](https://hardhat.org/docs)
- [Hardhat Ignition — Guia](https://hardhat.org/ignition/docs/getting-started)
- [Viem — Documentação](https://viem.sh/)
- [OpenZeppelin Contracts 5.x](https://docs.openzeppelin.com/contracts/5.x/)
- [Chainlink Data Feeds](https://docs.chain.link/data-feeds)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [Sepolia Faucet](https://sepoliafaucet.com/)
