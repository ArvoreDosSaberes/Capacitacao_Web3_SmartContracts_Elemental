# Tutorial: Configuração de Variáveis de Ambiente — Hardhat 3

[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_CONFIG.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_CONFIG)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Hardhat](https://img.shields.io/badge/Hardhat-v3.x-FFF100?logo=hardhat)
![Status](https://img.shields.io/badge/Status-Ready-brightgreen)

# Tutorial: Configuração de Variáveis de Ambiente — Elemental Protocol

## Guia Completo para Configurar chaves e URLs RPC no Hardhat 3

> **Importante:** Este projeto usa Hardhat 3 com sistema nativo de variáveis, **não** usa arquivos `.env`

---

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Obtendo as Credenciais](#3-obtendo-as-credenciais)
4. [Configurando Variáveis com Keystore](#4-configurando-variáveis-com-keystore)
5. [Verificando a Configuração](#5-verificando-a-configuração)
6. [Variáveis Opcionais](#6-variáveis-opcionais)
7. [Solução de Problemas](#7-solução-de-problemas)

---

## 1. Visão Geral do Sistema

### Como funciona o `configVariable()` no Hardhat 3

No Hardhat 3, as variáveis sensíveis são gerenciadas através do **keystore nativo**:

```typescript
// hardhat.config.ts
url: configVariable("SEPOLIA_RPC_URL"),
accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
```

**Vantagens:**

- ✅ **Seguro:** Valores criptografados localmente
- ✅ **Sem `.env`:** Não expõe credenciais no código
- ✅ **Nativo:** Integrado ao Hardhat
- ✅ **Interativo:** Digitação segura no terminal

---

## 2. Pré-requisitos

### 2.1. Acesso a RPC Provider

Você precisa de acesso a um provedor RPC para Sepolia:

- **Infura** (recomendado)
- **Alchemy**
- **QuickNode**
- Outro provedor compatível

### 2.2. Carteira Ethereum

Uma carteira com ETH em Sepolia para taxas de gas:

- **MetaMask** (mais comum)
- **WalletConnect**
- Hardware wallet (Ledger, Trezor)

---

## 3. Obtendo as Credenciais

### 3.1. URL do RPC Sepolia

#### Com Infura:

1. Acesse [infura.io](https://infura.io)
2. Crie conta gratuita
3. Crie novo projeto
4. Copie a URL Sepolia:
   ```
   https://sepolia.infura.io/v3/SUA_API_KEY
   ```

#### Com Alchemy:

1. Acesse [alchemy.com](https://alchemy.com)
2. Crie conta gratuita
3. Crie novo app
4. Copie a URL Sepolia:

   ```
   https://eth-sepolia.g.alchemy.com/v2/SUA_API_KEY
   ```

### # Com rede Pública

1. copie a URL Sepolia:

```
https://rpc.sepolia.org
```

### 3.2. Chave Privada

#### Do MetaMask:

1. Abra MetaMask
2. Clique nos 3 pontos → **Detalhes da conta**
3. Clique em **Exportar chave privada**
4. Digite sua senha
5. Copie a chave privada (começa com `0x`)

**⚠️ AVANÇO:** Nunca compartilhe sua chave privada!

---

## 4. Configurando Variáveis com Keystore

### 4.1. Configurar SEPOLIA_RPC_URL

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
```

O Hardhat pedirá o valor de forma segura:

```
? Please enter the value for SEPOLIA_RPC_URL: [input is hidden]
```

Cole sua URL RPC e pressione Enter.

### 4.2. Configurar SEPOLIA_PRIVATE_KEY

```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

```
? Please enter the value for SEPOLIA_PRIVATE_KEY: [input is hidden]
```

Cole sua chave privada e pressione Enter.

### 4.3. Configuração Completa

```bash
# Configurar RPC URL
npx hardhat keystore set SEPOLIA_RPC_URL
# Cole: https://sepolia.infura.io/v3/SUA_API_KEY

# Configurar chave privada
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
# Cole: 0xabc123... (sua chave privada)
```

---

## 5. Verificando a Configuração

### 5.1. Testar Conexão

```bash
# Verificar se consegue conectar à Sepolia
npx hardhat console --network sepolia
```

Se conectar sem erro, a configuração está correta.

### 5.2. Verificar Endereço e Saldo

**Método 1: Via deploy (funciona sempre)**

```bash
# Deploy de um contrato simples para ver o endereço
npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia
```

O deploy mostrará qual endereço está sendo usado como deployer.

**Método 2: Via script personalizado**

Crie `scripts/check-address.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  console.log("Deployer address:", accounts[0].address);
  
  const balance = await accounts[0].provider.getBalance(accounts[0].address);
  console.log(`Saldo: ${hre.ethers.formatEther(balance)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Execute:
```bash
npx hardhat run scripts/check-address.js --network sepolia
```

**Método 3: Deploy de teste (recomendado)**

```bash
# Deploy local primeiro para testar
npx hardhat node
# Em outro terminal:
npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network localhost
```

### 5.3. Listar Variáveis Configuradas

```bash
# Verificar todas as variáveis do keystore
npx hardhat keystore list
```

---

## 6. Variáveis Opcionais

### 6.1. Etherscan API Key (para verificação)

```bash
npx hardhat keystore set ETHERSCAN_API_KEY
```

Obtenha em [etherscan.io](https://etherscan.io/apis):

1. Crie conta gratuita
2. Vá para API Keys
3. Copie sua API Key

### 6.2. Outras Redes

Para outras redes, configure variáveis similares:

```bash
# Mainnet
npx hardhat keystore set MAINNET_RPC_URL
npx hardhat keystore set MAINNET_PRIVATE_KEY

# Polygon
npx hardhat keystore set POLYGON_RPC_URL
npx hardhat keystore set POLYGON_PRIVATE_KEY
```

---

## 7. Solução de Problemas

### 7.1. "Invalid URL" ou "Network Error"

**Causa:** URL RPC incorreta ou inválida

**Solução:**

1. Verifique se a URL está correta
2. Teste a URL com curl:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        https://sepolia.infura.io/v3/SUA_API_KEY
   ```

### 7.2. "Invalid private key"

**Causa:** Chave privada em formato incorreto

**Solução:**

1. Certifique-se que começa com `0x`
2. Verifique se tem 64 caracteres hexadecimais
3. Exporte novamente do MetaMask

### 7.3. "Insufficient funds"

**Causa:** Sem ETH para gas

**Solução:**

1. Obtenha ETH Sepolia gratuito:
   - [sepoliafaucet.com](https://sepoliafaucet.com)
   - [faucet.sepolia.dev](https://faucet.sepolia.dev)
2. Verifique o saldo antes do deploy

### 7.5. "TypeError: Cannot read properties of undefined (reading 'getWalletClients')"

**Causa:** Versão do Node.js incompatível com Hardhat 3

**Solução:**

1. **Verificar versão do Node.js:**

```bash
node --version
```

2. **Atualizar para Node.js 22.10.0+:**

```bash
# Usar nvm (recomendado)
nvm install 22
nvm use 22

# Ou baixar de nodejs.org
```

3. **Reinstalar dependências:**

```bash
rm -rf node_modules
npm install
```

4. **Testar novamente:**

```bash
npx hardhat console --network sepolia
```

### 7.8. "TypeError: Cannot read properties of undefined (reading 'getSigners')"

**Causa:** Hardhat 3 usa viem por padrão, não ethers

**Solução:**

**Opção 1: Usar viem (recomendado para Hardhat 3)**

```javascript
// scripts/check-address.js com viem
import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deployer address:", deployer.account.address);
  
  const balance = await deployer.getBalance();
  console.log(`Saldo: ${balance} wei`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

**Opção 2: Adicionar ethers ao projeto**

```bash
npm install --save-dev ethers
```

**Opção 3: Deploy direto (mais simples)**

```bash
npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia
```

---

## Resumo dos Comandos

### Configuração Inicial

```bash
# 1. Configurar RPC URL
npx hardhat keystore set SEPOLIA_RPC_URL

# 2. Configurar chave privada
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

# 3. (Opcional) Configurar Etherscan
npx hardhat keystore set ETHERSCAN_API_KEY
```

### Verificação

```bash
# Listar variáveis configuradas
npx hardhat keystore list

# Testar conexão
npx hardhat console --network sepolia

# Limpar keystore (se necessário)
npx hardhat keystore clear
```

---

## Próximos Passos

Após configurar as variáveis:

1. **Testar localmente:**

   ```bash
   npx hardhat ignition deploy ./ignition/modules/ElementalProtocol.ts --network localhost
   ```
2. **Deploy em Sepolia:**

   ```bash
   npx hardhat ignition deploy ./ignition/modules/ElementalProtocol.ts --network sepolia
   ```
3. **Verificar contratos:**

   ```bash
   npx hardhat verify <ENDEREÇO_DO_CONTRATO> --network sepolia
   ```

---

## 📚 Referências

- [Hardhat Documentation - Keystore](https://hardhat.org/hardhat-runner/docs/advanced/keystore)
- [Infura Documentation](https://docs.infura.io)
- [Alchemy Documentation](https://docs.alchemy.com)
- [Sepolia Faucet](https://sepoliafaucet.com)

---

**⚠️ AVANÇO FINAL:** Mantenha suas credenciais seguras! Nunca commit arquivos com chaves privadas ou use `.env` em projetos reais.
