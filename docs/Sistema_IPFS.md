![visitors](https://visitor-badge.laobi.icu/badge?page_id=elemental.sistema_ipfs)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![IPFS](https://img.shields.io/badge/IPFS-Public%20Storage-orange)
![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-ERC721-green)
![Status](https://img.shields.io/badge/Status-Implementado-brightgreen)
![Repository Size](https://img.shields.io/github/repo-size/elemental/elemental-nft)
![Last Commit](https://img.shields.io/github/last-commit/elemental/elemental-nft)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:d97706,50:ea580c,100:92400e&height=220&section=header&text=Sistema%20IPFS%20Elemental&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Armazenamento%20Descentralizado%20para%20NFTs%20de%20Alta%20Resolução&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Sistema IPFS Elemental Header"/>
</p>

## Sistema IPFS para Download de Alta Resolução

Sistema completo para upload e armazenamento de arquivos de alta resolução dos NFTs Elemental na rede IPFS, com integração direta ao contrato inteligente e interface web.

### Visão Geral

O sistema permite que os donos de NFTs baixem versões de alta resolução das criaturas Elemental, armazenadas de forma persistente na rede IPFS através de gateways públicos.

### Arquitetura do Sistema

```
Arquivos Locais (PNG/GIF) 
    -> Upload Script Python
    -> IPFS (Infura/Pinata)
    -> Hashes IPFS
    -> Smart Contract (ElemNFT)
    -> Interface Web
    -> Download para Usuários
```

## Componentes

### 1. Script de Upload IPFS (`scripts/ipfs_uploader.py`)

Cliente Python para upload de arquivos para IPFS via Infura API.

**Principais funcionalidades:**
- Upload de arquivos individuais ou diretórios
- Geração automática de metadados JSON
- Suporte a múltiplos gateways IPFS
- Verificação de persistência (pinning)

**Instalação:**
```bash
pip install -r requirements-ipfs.txt
```

**Configuração:**
```json
{
  "infura_project_id": "SUA_INFURA_PROJECT_ID",
  "infura_project_secret": "SUA_INFURA_PROJECT_SECRET",
  "pinata_api_key": "SUA_PINATA_API_KEY",
  "pinata_secret_key": "SUA_PINATA_SECRET_KEY"
}
```

**Uso básico:**
```bash
# Upload de arquivo único
python scripts/ipfs_uploader.py --file high_res/fire_elemental.png

# Upload de diretório completo
python scripts/ipfs_uploader.py --dir high_res/

# Upload com metadados NFT
python scripts/ipfs_uploader.py --file high_res/fire_elemental.png --nft-id 0 --name "Fire Elemental"
```

### 2. Script de Automação (`scripts/upload_nft_assets.py`)

Automatiza o upload de todos os assets NFT e atualização do contrato.

**Funcionalidades:**
- Upload em lote de todos os NFTs
- Atualização automática de metadados no contrato
- Geração de relatórios de upload
- Interface com blockchain via Web3.py

**Uso:**
```bash
# Upload apenas (sem atualizar contrato)
python scripts/upload_nft_assets.py --base-path .

# Upload e atualização do contrato
python scripts/upload_nft_assets.py \
  --base-path . \
  --update-contract \
  --rpc-url https://sepolia.infura.io/v3/YOUR_PROJECT_ID \
  --private-key $PRIVATE_KEY \
  --contract-address 0x...

# Upload de NFT específico
python scripts/upload_nft_assets.py --nft-id 0 --base-path .
```

### 3. Contrato Inteligente Atualizado (`contracts/ElemNFT.sol`)

O contrato foi estendido com suporte a metadados IPFS:

**Novas estruturas:**
```solidity
struct IPFSMetadata {
    string imageHash;        // Hash da imagem principal (GIF)
    string highResHash;     // Hash da versão de alta resolução (PNG)
    string metadataHash;    // Hash do JSON de metadados completo
    uint256 timestamp;      // Timestamp do upload
}
```

**Novas funções:**
- `updateIPFSMetadata()` - Atualiza metadados IPFS (owner apenas)
- `getHighResDownloadURL()` - Retorna URL de download de alta resolução
- `getIPFSMetadata()` - Retorna metadados IPFS completos
- `hasIPFSMetadata()` - Verifica se NFT tem metadados IPFS

**Eventos:**
- `IPFSMetadataUpdated()` - Emitido quando metadados são atualizados

### 4. Interface Web (`ui/js/app.js`)

Interface atualizada com botões de download para donos de NFTs.

**Novas funcionalidades:**
- Verificação automática de metadados IPFS
- Botões de download apenas para donos
- Download direto via gateway IPFS
- Feedback visual do status de download

## Fluxo de Uso

### Para Desenvolvedores

1. **Preparação dos Arquivos**
   ```bash
   # Criar diretório de alta resolução
   mkdir -p high_res/
   
   # Adicionar arquivos PNG de alta resolução
   # fire_elemental.png, water_spirit.png, etc.
   ```

2. **Configuração IPFS**
   ```bash
   # Editar configuração
   nano scripts/ipfs_config.json
   
   # Adicionar credenciais da Infura/Pinata
   ```

3. **Upload dos Assets**
   ```bash
   # Upload todos os NFTs
   python scripts/upload_nft_assets.py --base-path .
   
   # Upload e atualização do contrato (se necessário)
   python scripts/upload_nft_assets.py \
     --base-path . \
     --update-contract \
     --rpc-url $RPC_URL \
     --private-key $PRIVATE_KEY \
     --contract-address $CONTRACT_ADDRESS
   ```

### Para Usuários

1. **Aquisição do NFT**
   - Conectar carteira MetaMask
   - Mint do NFT desejado
   - Aguardar confirmação

2. **Download de Alta Resolução**
   - Acessar aba NFTs
   - Localizar NFT adquirido
   - Clicar em "Download Alta Resolução"
   - Arquivo baixado automaticamente

## Estrutura de Metadados

Os metadados seguem o padrão ERC-721 com extensões para alta resolução:

```json
{
  "name": "Fire Elemental",
  "description": "Fire Elemental - Elemental Creatures Collection",
  "image": "https://ipfs.io/ipfs/QmHash...",
  "external_url": "https://elemental-creatures.com",
  "attributes": [
    {
      "trait_type": "Collection",
      "value": "Elemental Creatures"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Element",
      "value": "Fire"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://ipfs.io/ipfs/QmGifHash...",
        "type": "image/gif"
      },
      {
        "uri": "https://ipfs.io/ipfs/QmHighResHash...",
        "type": "image/png",
        "display_type": "high_resolution"
      }
    ],
    "category": "image"
  },
  "high_resolution_download": "https://ipfs.io/ipfs/QmHighResHash...",
  "token_id": 0
}
```

## Gateways IPFS Suportados

O sistema suporta múltiplos gateways para redundância:

1. **IPFS.io** - Gateway público oficial
2. **Pinata Cloud** - Gateway com pinning persistente
3. **Infura IPFS** - Gateway enterprise
4. **Cloudflare IPFS** - Gateway global rápido

## Segurança e Persistência

### Pinning Automático

Todos os arquivos são automaticamente fixados (pinned) para garantir persistência:

- **Pinata**: Pinning via API key
- **Infura**: Pinning automático via upload
- **Redundância**: Múltiplos gateways

### Verificação de Integridade

- Hash SHA-256 para verificação local
- Verificação de CID IPFS pós-upload
- Logs detalhados de todas as operações

## Custos e Limitações

### Custos IPFS

- **Infura**: Free tier com limites de requisição
- **Pinata**: 1GB gratuito, depois $0.15/GB
- **Gateways**: Acesso público gratuito

### Limitações

- Tamanho máximo por arquivo: 100MB (Infura free tier)
- Taxa de requisição: 100 req/min (Infura)
- Necessita conexão internet para download

## Troubleshooting

### Problemas Comuns

1. **Upload falha com erro 429**
   - Limite de taxa da Infura atingido
   - Aguardar 1 minuto e tentar novamente

2. **Download não inicia**
   - Verificar se usuário é dono do NFT
   - Confirmar metadados IPFS existem

3. **Contrato não atualiza**
   - Verificar permissões de owner
   - Confirmar saldo de gas suficiente

### Logs e Debug

```bash
# Verificar logs de upload
cat ipfs_uploads.json

# Verificar logs de metadados
cat metadata_nft_*.json

# Debug do contrato
npx hardhat console --network sepolia
```

## Próximos Passos

### Roadmap de Desenvolvimento

1. **Integração com Arweave**
   - Armazenamento permanente alternativo
   - Redundância adicional

2. **CDN IPFS Próprio**
   - Gateway dedicado para melhor performance
   - Analytics de uso

3. **Sistema de Streaming**
   - Preview streaming de alta resolução
   - Zoom interativo

4. **Marketplace Integration**
   - Listagem automática em marketplaces
   - Metadados enriquecidos

## Contribuição

Para contribuir com o sistema IPFS:

1. Fork do repositório
2. Feature branch para mudanças
3. Testes completos de upload/download
4. PR com descrição detalhada

## Licença

Este sistema está licenciado sob CC BY-SA 4.0, permitindo uso comercial com atribuição.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:92400e,50:ea580c,100:d97706&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Sistema completo para armazenamento e distribuição de arquivos de alta resolução de NFTs via IPFS, com integração blockchain e interface web.
**Data de Criação:** 2025-04-02
**Autor:** Sistema Elemental
**Versão:** 1.0
**Última Atualização:** 2025-04-02
**Atualizado por:** Sistema Elemental
**Histórico de Alterações:**
- 2025-04-02 - Criado por Sistema Elemental - Versão 1.0 - Implementação completa do sistema IPFS para NFTs Elemental
