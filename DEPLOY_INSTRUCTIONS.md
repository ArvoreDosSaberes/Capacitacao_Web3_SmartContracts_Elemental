# Instruções de Deploy - Elemental Protocol

## Pré-requisitos

1. **Node.js 22.16.0** (use `nvm use 22.16`)
2. **ETH na Sepolia** para taxas de deploy (~0.01 ETH)
3. **Private Key** da carteira de deploy
4. **RPC URL** (Infura, Alchemy, ou outro provider)

## Configuração

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env com seus dados
nano .env
```

### 2. Preencher o .env

```env
# Private Key da carteira (começa com 0x...)
PRIVATE_KEY=0x1234567890abcdef...

# URL do RPC da Sepolia
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# API Key do Etherscan (opcional)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

## Deploy

### Método 1: Hardhat Ignition (Recomendado)

```bash
# Ativar Node.js correto
source ~/.nvm/nvm.sh && nvm use 22.16

# Deploy via Ignition
npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia
```

### Método 2: Script Simplificado

```bash
# Ativar Node.js correto
source ~/.nvm/nvm.sh && nvm use 22.16

# Deploy via script
node scripts/deploy-simple.js
```

## Verificação do Deploy

Após o deploy, os endereços serão salvos em:
- `deployed-addresses-sepolia.json`
- Atualizado automaticamente em `Relatorio_Tecnico_Elemental.md`

## Contratos Deployados

1. **ElemToken** - Token ERC-20 de utilidade
2. **ElemNFT** - Coleção NFT ERC-721
3. **PriceFeed** - Wrapper do Chainlink Price Feed
4. **ElemStaking** - Contrato de staking
5. **ElemDAO** - Contrato de governança
6. **MockAggregator** - Oracle mock para testes

## Pós-Deploy

1. **Verificar contratos** no Etherscan
2. **Atualizar UI** com novos endereços em `ui/js/app.js`
3. **Testar funcionalidades** na Sepolia
4. **Executar auditoria** pós-deploy

## Segurança

- **NUNCA** commit o arquivo `.env`
- **NUNCA** compartilhe sua private key
- Use **carteira multisig** para produção
- **Verifique** os endereços antes de usar

## Troubleshooting

### Erro: PRIVATE_KEY não configurado
```bash
export PRIVATE_KEY="0x..."
```

### Erro: Saldo insuficiente
- Verifique saldo na Sepolia: https://sepoliafaucet.com/

### Erro: Conexão RPC
- Verifique URL do RPC no .env
- Teste conexão com: `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' $SEPOLIA_URL`

## Endereços de Exemplo

Para testes, você pode usar os endereços simulados em `deployed-addresses-sepolia.json`.

---

**Suporte:** Consulte o arquivo `Relatorio_Tecnico_Elemental.md` para detalhes técnicos completos.
