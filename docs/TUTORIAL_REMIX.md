# Tutorial: Deploy dos Contratos Elemental no Remix IDE

## Visão Geral

Este tutorial guia você passo a passo no deploy dos contratos inteligentes do projeto Elemental usando o Remix IDE. O protocolo consiste em 4 contratos principais que devem ser implantados em uma ordem específica devido às suas dependências.

## Pré-requisitos

- MetaMask ou outra carteira Ethereum configurada
- Conta com saldo de ETH para taxas de gás (testnet ou mainnet)
- Acesso ao Remix IDE (https://remix.ethereum.org)

## Estrutura dos Contratos

1. **ElemToken.sol** - Token ERC20 de utilidade (sem dependências)
2. **ElemNFT.sol** - Coleção NFT ERC721 (sem dependências)
3. **ElemStaking.sol** - Contrato de staking (depende do ElemToken e oráculo)
4. **ElemDAO.sol** - Contrato de governança (depende do ElemToken)

## Passo 1: Configuração do Remix

### 1.1 Acessar o Remix
- Abra https://remix.ethereum.org no seu navegador
- O Remix abrirá com uma workspace padrão

### 1.2 Criar Nova Workspace
- Clique no ícone de pasta (File Explorers) na barra lateral esquerda
- Clique em "Create New Workspace"
- Nomeie como "Elemental Protocol"
- Escolha o template "Blank"
- Clique em "Continue"

### 1.3 Estrutura de Arquivos
Crie a seguinte estrutura de pastas:
```
contracts/
  ElemToken.sol
  ElemNFT.sol
  ElemStaking.sol
  ElemDAO.sol
mocks/
  MockAggregator.sol
```

## Passo 2: Upload dos Contratos

### 2.1 Upload dos Arquivos
- Clique com o botão direito na pasta `contracts`
- Selecione "Upload Files"
- Faça upload dos 4 arquivos de contratos da pasta `contracts/` do projeto

### 2.2 Upload do Mock
- Clique com o botão direito na pasta `mocks`
- Faça upload do arquivo `MockAggregator.sol` para testes locais

### 2.3 Conteúdo do MockAggregator.sol
Crie o arquivo `mocks/MockAggregator.sol` com o seguinte conteúdo:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract MockAggregator is AggregatorV3Interface {
    int256 private price;
    
    constructor(int256 _price) {
        price = _price;
    }
    
    function getLatestPrice() external view returns (int256) {
        return price;
    }
    
    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (1, price, block.timestamp, block.timestamp, 1);
    }
    
    function updatePrice(int256 _price) external {
        price = _price;
    }
}
```

## Passo 3: Compilação dos Contratos

### 3.1 Configurar Compilador
- Vá para a aba "Solidity Compiler" (ícone de compilador)
- Selecione a versão `0.8.20` ou superior
- Mantenha as configurações padrão (Enable optimization: 200 runs)

### 3.2 Compilar Todos os Contratos
- Clique em "Compile ElemToken.sol"
- Aguarde a compilação bem-sucedida (checkmark verde)
- Repita para: ElemNFT.sol, ElemStaking.sol, ElemDAO.sol, MockAggregator.sol

## Passo 4: Deploy - Ordem Correta

### 4.1 Configurar Environment
- Vá para a aba "Deploy & Run Transactions" (ícone de seta para baixo)
- **ENVIRONMENT**: Selecione "Injected Provider - MetaMask"
- Conecte sua carteira MetaMask quando solicitado
- Escolha a rede correta (Sepolia, Goerli, Mainnet, etc.)

### 4.2 Deploy 1: ElemToken
- Selecione o contrato `ElemToken` no dropdown
- No campo "Deploy", insira seu endereço como parâmetro `initialOwner`
- Clique em "Deploy"
- Aguarde a confirmação da transação
- Copie o endereço do contrato implantado

### 4.3 Deploy 2: ElemNFT
- Selecione o contrato `ElemNFT`
- Insira seu endereço como `initialOwner`
- Clique em "Deploy"
- Aguarde a confirmação
- Copie o endereço do contrato

### 4.4 Deploy 3: MockAggregator (para testes)
- Selecione o contrato `MockAggregator`
- Insira `200000000000` como preço inicial (2000 USD com 8 decimais)
- Clique em "Deploy"
- Copie o endereço do mock

### 4.5 Deploy 4: ElemStaking
- Selecione o contrato `ElemStaking`
- Preencha os parâmetros:
  - `_elemToken`: Endereço do ElemToken implantado
  - `_priceFeed`: Endereço do MockAggregator (ou oráculo real)
  - `initialOwner`: Seu endereço
- Clique em "Deploy"

### 4.6 Deploy 5: ElemDAO
- Selecione o contrato `ElemDAO`
- Preencha os parâmetros:
  - `_elemToken`: Endereço do ElemToken implantado
  - `initialOwner`: Seu endereço
- Clique em "Deploy"

## Passo 5: Configuração Pós-Deploy

### 5.1 Aprovar Token para Staking
- No "Deployed Contracts", encontre o ElemToken
- Expanda e encontre a função `approve`
- Preencha:
  - `spender`: Endereço do ElemStaking
  - `amount`: Valor a aprovar (ex: 1000000000000000000 para 1 token)
- Clique em "transact"

### 5.2 Configurar Permissões
- Verifique se você é o owner de todos os contratos
- Teste funções básicas de cada contrato

## Passo 6: Teste das Funcionalidades

### 6.1 Testar ElemToken
```solidity
// Verificar saldo
balanceOf(seu_endereco)

// Transferir tokens
transfer(destinatario, quantidade_em_wei)
```

### 6.2 Testar ElemNFT
```solidity
// Mint de NFT (precisa de ETH)
mint("ipfs://seu_metadata_uri")

// Verificar nome da criatura
creatureName(tokenId)
```

### 6.3 Testar ElemStaking
```solidity
// Fazer stake
stake(quantidade_em_wei)

// Verificar recompensas pendentes
pendingReward(seu_endereco)

// Coletar recompensas
claimReward()
```

### 6.4 Testar ElemDAO
```solidity
// Criar proposta
createProposal("Descrição da proposta")

// Votar
vote(proposalId, true) // true = a favor
```

## Passo 7: Oráculos em Produção

### 7.1 Para Mainnet/Testnet Real
Substitua o MockAggregator por oráculos Chainlink:

**Sepolia Testnet:**
- ETH/USD: `0x694AA1769357215DE4FAC081bf1f309aDC325306`

**Goerli Testnet:**
- ETH/USD: `0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e`

**Mainnet:**
- ETH/USD: `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`

### 7.2 Deploy com Oráculo Real
- Pule o passo 4.5 (MockAggregator)
- No deploy do ElemStaking, use o endereço do oráculo real como `_priceFeed`

## Passo 8: Verificação e Frontend

### 8.1 Verificação em Exploradores
- Vá ao explorador de blocos da rede (Etherscan, Sepolia Explorer)
- Procure o endereço do contrato
- Clique em "Contract" -> "Verify and Publish"
- Selecione "Solidity (Single File)"
- Use a mesma versão do compilador
- Cole o código fonte do contrato
- Execute a verificação

### 8.2 Integração com Frontend
Use os endereços dos contratos implantados no seu frontend:
```javascript
const contracts = {
  elemToken: "0x...",
  elemNFT: "0x...",
  elemStaking: "0x...",
  elemDAO: "0x..."
};
```

## Troubleshooting

### Problemas Comuns

**"Insufficient funds"**
- Verifique se você tem ETH suficiente para gás
- Aumente o limite de gás se necessário

**"Transaction reverted"**
- Verifique se os parâmetros estão corretos
- Confirme a ordem do deploy

**"Contract verification failed"**
- Use exatamente o mesmo código fonte
- Verifique a versão do compilador

**"Oracle price returned 0"**
- Use um oráculo válido para a rede
- Para testes, use o MockAggregator

### Dicas Úteis

1. **Sempre teste em testnet antes da mainnet**
2. **Salve todos os endereços dos contratos**
3. **Mantenha uma cópia do código fonte**
4. **Verifique os contratos após o deploy**
5. **Use limites de gás apropriados**

## Resumo dos Endereços

Mantenha um registro dos endereços implantados:

```markdown
# Contratos Elemental - [REDE]

## ElemToken (ERC20)
- Endereço: `0x...`
- Owner: `seu_endereco`

## ElemNFT (ERC721)
- Endereço: `0x...`
- Owner: `seu_endereco`

## ElemStaking
- Endereço: `0x...`
- Token: `endereço_elem_token`
- Oracle: `endereço_oráculo`

## ElemDAO
- Endereço: `0x...`
- Token: `endereço_elem_token`
```

## Próximos Passos

Após o deploy bem-sucedido:

1. Configure o frontend para interagir com os contratos
2. Implemente sistemas de monitoramento
3. Crie documentação para usuários
4. Planeje atualizações e melhorias

---

**Nota:** Este tutorial assume que você está familiarizado com conceitos básicos de Ethereum e smart contracts. Para dúvidas adicionais, consulte a documentação oficial do Remix e do OpenZeppelin.
