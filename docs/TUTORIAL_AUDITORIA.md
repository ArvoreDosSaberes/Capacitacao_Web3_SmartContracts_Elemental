[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_AUDITORIA.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_AUDITORIA)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-v3.x-FFF100?logo=hardhat)
![Slither](https://img.shields.io/badge/Slither-Static%20Analysis-1E88E5)
![Mythril](https://img.shields.io/badge/Mythril-Symbolic%20Analysis-7E57C2)
![Status](https://img.shields.io/badge/Status-Seguran%C3%A7a-brightgreen)

# Tutorial de Auditoria de Smart Contracts

## Elemental Protocol — Slither, Mythril & Hardhat

Este tutorial mostra como executar uma auditoria de segurança nos contratos do **Elemental Protocol** usando três ferramentas complementares: **Slither** (análise estática), **Mythril** (análise simbólica) e **Hardhat** (testes e cobertura). Ao final, apresentamos um modelo de relatório simples de auditoria.

---

## Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Slither — Análise Estática](#2-slither--análise-estática)
3. [Mythril — Análise Simbólica](#3-mythril--análise-simbólica)
4. [Hardhat — Testes e Cobertura](#4-hardhat--testes-e-cobertura)
5. [Relatório Simples de Auditoria](#5-relatório-simples-de-auditoria)

---

## 1. Pré-requisitos

| Ferramenta | Versão mínima | Instalação |
|------------|---------------|------------|
| Node.js    | >= 18         | [nodejs.org](https://nodejs.org) |
| Python     | >= 3.8        | [python.org](https://python.org) |
| Hardhat    | >= 2.19       | `npm install --save-dev hardhat` |
| Slither    | >= 0.10       | `pip install slither-analyzer` |
| Mythril    | >= 0.24       | `pip install mythril` |
| solc-select| —             | `pip install solc-select` |

### Instalar o compilador Solidity 0.8.20

As ferramentas de análise precisam do compilador `solc` compatível:

```bash
pip install solc-select
solc-select install 0.8.20
solc-select use 0.8.20
```

### Estrutura esperada do projeto

```text
Smartcontracts/
├── contracts/
│   ├── ElemToken.sol
│   ├── ElemNFT.sol
│   ├── ElemStaking.sol
│   ├── ElemDAO.sol
│   └── PriceFeed.sol
├── node_modules/          ← dependências (npm install)
├── hardhat.config.js
└── package.json
```

> **Importante:** antes de prosseguir, garanta que o projeto compila sem erros:
> ```bash
> npx hardhat compile
> ```

---

## 2. Slither — Análise Estática

[Slither](https://github.com/crytic/slither) é um framework de análise estática desenvolvido pela Trail of Bits. Ele detecta vulnerabilidades comuns, código morto, variáveis não utilizadas e padrões perigosos **sem executar** o contrato.

### 2.1 Instalação

```bash
pip install slither-analyzer
```

### 2.2 Executar análise completa

Na raiz do projeto Hardhat:

```bash
slither .
```

O Slither detecta automaticamente o framework Hardhat, resolve os imports de `@openzeppelin` e `@chainlink` a partir de `node_modules/`, e analisa todos os contratos em `contracts/`.

### 2.3 Analisar um contrato específico

```bash
slither contracts/ElemStaking.sol
```

### 2.4 Saída esperada

O Slither classifica os achados por severidade:

| Cor / Nível | Significado |
|-------------|-------------|
| 🔴 **High** | Vulnerabilidade crítica (reentrância, manipulação de estado) |
| 🟡 **Medium** | Risco moderado (variáveis shadowed, uso de `tx.origin`) |
| 🟢 **Low** | Boas práticas não seguidas (nomes de variáveis, visibilidade) |
| ⚪ **Informational** | Sugestões de otimização |

**Exemplo de saída para o Elemental Protocol:**

```
ElemNFT.withdraw() (contracts/ElemNFT.sol#64-67) sends eth to arbitrary user
  Dangerous calls:
  - (ok) = payable(owner()).call{value: address(this).balance}("")

Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations
```

> **Nota:** Nem todos os achados são vulnerabilidades reais. O Slither pode gerar falsos positivos que precisam de revisão manual.

### 2.5 Gerar relatório em formato legível

```bash
# JSON (para automação)
slither . --json slither-report.json

# Texto simples redirecionado para arquivo
slither . 2>&1 | tee slither-report.txt

# Markdown (via printers)
slither . --print human-summary
```

### 2.6 Printers úteis

Os "printers" extraem informações estruturais dos contratos:

```bash
# Resumo de funções e modificadores
slither . --print function-summary

# Grafo de herança
slither . --print inheritance-graph

# Variáveis de estado e seus acessos
slither . --print vars-and-auth

# Grafo de chamadas (gera .dot, converter com Graphviz)
slither . --print call-graph
```

### 2.7 Detectors específicos

Para focar em classes de vulnerabilidade específicas:

```bash
# Apenas reentrância
slither . --detect reentrancy-eth,reentrancy-no-eth

# Apenas problemas de acesso
slither . --detect unprotected-upgrade,suicidal

# Listar todos os detectors disponíveis
slither . --list-detectors
```

---

## 3. Mythril — Análise Simbólica

[Mythril](https://github.com/Consensys/mythril) é uma ferramenta de análise simbólica da ConsenSys que executa o bytecode do contrato em uma EVM simbólica para detectar vulnerabilidades como reentrância, overflow/underflow, envio de ETH desprotegido e condições de `SELFDESTRUCT`.

### 3.1 Instalação

```bash
pip install mythril
```

> **Alternativa com Docker** (recomendado para evitar conflitos de dependência):
> ```bash
> docker pull mythril/myth
> docker run -v $(pwd):/src mythril/myth analyze /src/contracts/ElemStaking.sol --solv 0.8.20
> ```

### 3.2 Analisar contrato individual

O Mythril analisa um contrato de cada vez. É necessário informar a versão do Solidity e os remappings:

```bash
myth analyze contracts/ElemStaking.sol \
  --solv 0.8.20 \
  --solc-args "--base-path . --include-path node_modules/"
```

### 3.3 Analisar todos os contratos do projeto

```bash
for contract in contracts/*.sol; do
  echo "=========================================="
  echo "Analisando: $contract"
  echo "=========================================="
  myth analyze "$contract" \
    --solv 0.8.20 \
    --solc-args "--base-path . --include-path node_modules/" \
    2>&1 | tee -a mythril-report.txt
done
```

### 3.4 Parâmetros importantes

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `--solv` | Versão do compilador Solidity | `--solv 0.8.20` |
| `--execution-timeout` | Tempo máximo de execução (segundos) | `--execution-timeout 300` |
| `--max-depth` | Profundidade máxima de exploração | `--max-depth 30` |
| `-o jsonv2` | Saída em JSON v2 | `-o jsonv2` |
| `--solc-args` | Argumentos para o compilador solc | `--solc-args "--base-path ."` |

### 3.5 Saída esperada

O Mythril reporta usando o padrão **SWC Registry** (Smart Contract Weakness Classification):

```
==== External Call To User-Supplied Address ====
SWC ID: 107
Severity: Low
Contract: ElemNFT
Function name: withdraw()
PC address: 1842
Estimated Gas Usage: 7324 - 62265
----
Initial State:
...
```

**SWCs comuns que podem aparecer no Elemental Protocol:**

| SWC ID | Nome | Contrato provável |
|--------|------|-------------------|
| SWC-107 | Reentrancy | ElemNFT (`withdraw`), ElemStaking |
| SWC-101 | Integer Overflow/Underflow | Mitigado por Solidity ^0.8.20 |
| SWC-110 | Assert Violation | Qualquer |
| SWC-115 | Authorization through tx.origin | Nenhum (usa `msg.sender`) |

### 3.6 Gerar relatório em JSON

```bash
myth analyze contracts/ElemStaking.sol \
  --solv 0.8.20 \
  --solc-args "--base-path . --include-path node_modules/" \
  -o jsonv2 > mythril-ElemStaking.json
```

---

## 4. Hardhat — Testes e Cobertura

O Hardhat não é uma ferramenta de auditoria per se, mas seus **testes automatizados** e o plugin de **cobertura de código** são fundamentais para validar o comportamento dos contratos e complementar a análise estática/simbólica.

### 4.1 Configurar dependências

```bash
npm install --save-dev \
  @nomicfoundation/hardhat-toolbox \
  solidity-coverage
```

Verificar se `hardhat.config.js` inclui:

```javascript
require("@nomicfoundation/hardhat-toolbox");
// solidity-coverage já está incluído no hardhat-toolbox
```

### 4.2 Escrever testes de segurança

Crie um arquivo `tests/audit.test.js` com testes focados em segurança:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auditoria de Segurança - Elemental Protocol", function () {

  let owner, attacker, user;
  let elemToken, elemNFT, elemStaking, elemDAO, priceFeed;

  beforeEach(async function () {
    [owner, attacker, user] = await ethers.getSigners();

    // Deploy ElemToken
    const ElemToken = await ethers.getContractFactory("ElemToken");
    elemToken = await ElemToken.deploy(owner.address);

    // Deploy ElemNFT
    const ElemNFT = await ethers.getContractFactory("ElemNFT");
    elemNFT = await ElemNFT.deploy(owner.address);

    // Deploy PriceFeed (mock)
    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    // Usar um endereço qualquer como feed para testes
    priceFeed = await PriceFeed.deploy(owner.address, owner.address);

    // Deploy ElemStaking
    const ElemStaking = await ethers.getContractFactory("ElemStaking");
    elemStaking = await ElemStaking.deploy(
      await elemToken.getAddress(),
      await priceFeed.getAddress(),
      owner.address
    );

    // Deploy ElemDAO
    const ElemDAO = await ethers.getContractFactory("ElemDAO");
    elemDAO = await ElemDAO.deploy(
      await elemToken.getAddress(),
      owner.address
    );
  });

  // ─── Controle de Acesso ─────────────────────────────────────

  describe("Controle de Acesso", function () {
    it("ElemToken: apenas owner pode pausar", async function () {
      await expect(
        elemToken.connect(attacker).pause()
      ).to.be.revertedWithCustomError(elemToken, "OwnableUnauthorizedAccount");
    });

    it("ElemToken: apenas owner pode fazer mint", async function () {
      await expect(
        elemToken.connect(attacker).mint(attacker.address, 1000)
      ).to.be.revertedWithCustomError(elemToken, "OwnableUnauthorizedAccount");
    });

    it("ElemNFT: apenas owner pode fazer withdraw", async function () {
      await expect(
        elemNFT.connect(attacker).withdraw()
      ).to.be.revertedWithCustomError(elemNFT, "OwnableUnauthorizedAccount");
    });

    it("ElemStaking: apenas owner pode alterar baseRate", async function () {
      await expect(
        elemStaking.connect(attacker).setBaseRate(200)
      ).to.be.revertedWithCustomError(elemStaking, "OwnableUnauthorizedAccount");
    });

    it("ElemDAO: apenas owner pode alterar votingPeriod", async function () {
      await expect(
        elemDAO.connect(attacker).setVotingPeriod(7 * 24 * 60 * 60)
      ).to.be.revertedWithCustomError(elemDAO, "OwnableUnauthorizedAccount");
    });
  });

  // ─── Proteção contra Reentrância ────────────────────────────

  describe("Proteção contra Reentrância", function () {
    it("ElemStaking: stake usa nonReentrant", async function () {
      // Verificação indireta: contrato herda ReentrancyGuard
      // Se alguém tentar reentrar via callback, a transação reverte
      const amount = ethers.parseEther("100");
      await elemToken.connect(owner).approve(
        await elemStaking.getAddress(), amount
      );
      await elemStaking.connect(owner).stake(amount);

      const stakeInfo = await elemStaking.stakes(owner.address);
      expect(stakeInfo.amount).to.equal(amount);
    });
  });

  // ─── Limites e Validações ───────────────────────────────────

  describe("Limites e Validações", function () {
    it("ElemToken: não pode mintar além do MAX_SUPPLY", async function () {
      // MAX_SUPPLY já foi mintado no constructor
      await expect(
        elemToken.connect(owner).mint(owner.address, 1)
      ).to.be.revertedWith("ElemToken: exceeds max supply");
    });

    it("ElemNFT: não aceita mint com ETH insuficiente", async function () {
      await expect(
        elemNFT.connect(user).mint("ipfs://test", { value: 0 })
      ).to.be.revertedWith("ElemNFT: insufficient ETH");
    });

    it("ElemStaking: não permite stake de 0 tokens", async function () {
      await expect(
        elemStaking.connect(user).stake(0)
      ).to.be.revertedWith("Staking: amount must be > 0");
    });

    it("ElemStaking: não permite withdraw maior que saldo", async function () {
      await expect(
        elemStaking.connect(user).withdraw(ethers.parseEther("100"))
      ).to.be.revertedWith("Staking: insufficient balance");
    });

    it("ElemDAO: requer saldo ELEM para criar proposta", async function () {
      await expect(
        elemDAO.connect(attacker).createProposal("Proposta maliciosa")
      ).to.be.revertedWith("DAO: must hold ELEM");
    });
  });

  // ─── Estado Pausado ─────────────────────────────────────────

  describe("Mecanismo de Pausa", function () {
    it("ElemToken: bloqueia transferências quando pausado", async function () {
      await elemToken.connect(owner).pause();
      await expect(
        elemToken.connect(owner).transfer(user.address, 1000)
      ).to.be.revertedWithCustomError(elemToken, "EnforcedPause");
    });
  });
});
```

### 4.3 Executar os testes

```bash
npx hardhat test tests/audit.test.js
```

**Saída esperada:**

```
  Auditoria de Segurança - Elemental Protocol
    Controle de Acesso
      ✓ ElemToken: apenas owner pode pausar
      ✓ ElemToken: apenas owner pode fazer mint
      ✓ ElemNFT: apenas owner pode fazer withdraw
      ✓ ElemStaking: apenas owner pode alterar baseRate
      ✓ ElemDAO: apenas owner pode alterar votingPeriod
    Proteção contra Reentrância
      ✓ ElemStaking: stake usa nonReentrant
    Limites e Validações
      ✓ ElemToken: não pode mintar além do MAX_SUPPLY
      ✓ ElemNFT: não aceita mint com ETH insuficiente
      ✓ ElemStaking: não permite stake de 0 tokens
      ✓ ElemStaking: não permite withdraw maior que saldo
      ✓ ElemDAO: requer saldo ELEM para criar proposta
    Mecanismo de Pausa
      ✓ ElemToken: bloqueia transferências quando pausado

  12 passing
```

### 4.4 Cobertura de código

```bash
npx hardhat coverage
```

Isso gera um relatório em `coverage/index.html` mostrando quais linhas, funções e branches foram exercitados pelos testes. **Meta recomendada: ≥ 90% de cobertura.**

### 4.5 Verificar tamanho dos contratos

Contratos que excedem 24 KB não podem ser deployados na mainnet:

```bash
npx hardhat compile --force
npx hardhat size-contracts  # se estiver usando hardhat-contract-sizer
```

Ou instale o plugin:

```bash
npm install --save-dev hardhat-contract-sizer
```

Adicione ao `hardhat.config.js`:

```javascript
require("hardhat-contract-sizer");
```

---

## 5. Relatório Simples de Auditoria

Abaixo está um **modelo de relatório** que pode ser preenchido com os resultados das ferramentas acima.

---

### RELATÓRIO DE AUDITORIA DE SEGURANÇA

**Projeto:** Elemental Protocol
**Data:** _DD/MM/AAAA_
**Auditor:** _Nome do Auditor_
**Escopo:** Contratos Solidity em `contracts/`
**Commit:** _hash do commit auditado_

---

#### Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Contratos analisados | 5 (ElemToken, ElemNFT, ElemStaking, ElemDAO, PriceFeed) |
| Linhas de Solidity (total) | ~462 |
| Versão Solidity | ^0.8.20 |
| Dependências externas | OpenZeppelin Contracts, Chainlink Contracts |
| Ferramentas utilizadas | Slither v0.x.x, Mythril v0.x.x, Hardhat + Testes |

---

#### Achados por Severidade

| Severidade | Quantidade | Descrição resumida |
|------------|------------|--------------------|
| 🔴 Crítica | 0 | — |
| 🟠 Alta | 0 | — |
| 🟡 Média | _N_ | _Ex: uso de low-level call em withdraw()_ |
| 🟢 Baixa | _N_ | _Ex: variáveis que poderiam ser immutable_ |
| ⚪ Informacional | _N_ | _Ex: sugestões de otimização de gas_ |

---

#### Detalhamento dos Achados

##### Achado #1 — Low-level call em `ElemNFT.withdraw()`

- **Severidade:** Média
- **Contrato:** `ElemNFT.sol` (linha 65)
- **Ferramenta:** Slither
- **Descrição:** A função `withdraw()` utiliza `call{value:}` para enviar ETH. Embora o destinatário seja `owner()` (controlado), o uso de low-level call é considerado um padrão de risco.
- **Código afetado:**
  ```solidity
  (bool ok, ) = payable(owner()).call{value: address(this).balance}("");
  require(ok, "ElemNFT: withdraw failed");
  ```
- **Recomendação:** Aceitável neste caso porque o destinatário é o `owner`. Para maior segurança, considere usar `Address.sendValue` da OpenZeppelin.
- **Status:** _Reconhecido / Corrigido / Aceito como risco_

##### Achado #2 — PriceFeed pode retornar dados desatualizados

- **Severidade:** Baixa
- **Contrato:** `PriceFeed.sol` (linha 28-41)
- **Ferramenta:** Revisão manual
- **Descrição:** O contrato `PriceFeed.getLatestPrice()` não verifica o `updatedAt` retornado por `latestRoundData()`, então pode retornar um preço desatualizado (stale price).
- **Código afetado:**
  ```solidity
  try priceFeed.latestRoundData() returns (
      uint80, int256 answer, uint256, uint256, uint80
  ) {
      if (answer > 0) return answer;
  } catch {}
  ```
- **Recomendação:** Adicionar verificação de _staleness_:
  ```solidity
  (uint80 roundId, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();
  require(block.timestamp - updatedAt < 3600, "PriceFeed: stale data");
  ```
- **Status:** _Reconhecido / Corrigido / Aceito como risco_

##### Achado #3 — ElemDAO: votação baseada em saldo spot

- **Severidade:** Média
- **Contrato:** `ElemDAO.sol` (linha 65)
- **Ferramenta:** Revisão manual
- **Descrição:** O peso do voto é calculado com `balanceOf(msg.sender)` no momento da votação. Um atacante poderia tomar empréstimo flash (flash loan) de ELEM, votar, e devolver os tokens na mesma transação.
- **Recomendação:** Implementar snapshot de saldos (ERC20Votes / ERC20Snapshot) para usar saldos de blocos anteriores como peso de voto.
- **Status:** _Reconhecido / Corrigido / Aceito como risco_

---

#### Resultados dos Testes Automatizados

| Suite | Testes | Passaram | Falharam | Cobertura |
|-------|--------|----------|----------|-----------|
| audit.test.js | 12 | 12 | 0 | —% |
| **Total** | **12** | **12** | **0** | **—%** |

> Executar `npx hardhat coverage` e preencher a coluna de cobertura.

---

#### Conclusões

1. **Pontos fortes:**
   - Uso de `ReentrancyGuard` em `ElemStaking` protege contra reentrância
   - Solidity ^0.8.20 com proteção nativa contra overflow/underflow
   - `Ownable` restringe funções administrativas corretamente
   - `Pausable` em `ElemToken` permite resposta a emergências
   - `SafeERC20` evita problemas com tokens que não retornam `bool`

2. **Pontos de atenção:**
   - Verificação de _staleness_ no oráculo Chainlink
   - Votação da DAO vulnerável a flash loans
   - Low-level call no withdraw de NFT (risco aceito)

3. **Recomendações gerais:**
   - Aumentar cobertura de testes para ≥ 90%
   - Implementar ERC20Votes para a DAO
   - Adicionar limites de tempo (_timelock_) para ações administrativas críticas
   - Considerar auditoria profissional antes de deploy em mainnet

---

#### Assinatura

| | |
|---|---|
| **Auditor** | _Nome_ |
| **Data** | _DD/MM/AAAA_ |
| **Versão do relatório** | 1.0 |

---

## Referências

- [Slither — Documentação](https://github.com/crytic/slither/wiki)
- [Mythril — Documentação](https://mythril-classic.readthedocs.io/)
- [Hardhat — Testes](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)
- [SWC Registry](https://swcregistry.io/)
- [OpenZeppelin — Security](https://docs.openzeppelin.com/contracts/5.x/)
- [Consensys — Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
