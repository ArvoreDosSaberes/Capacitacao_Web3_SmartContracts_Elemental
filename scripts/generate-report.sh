#!/bin/bash

# Script para automatizar a geração do relatório técnico do Elemental Protocol
# Autor: Projeto Elemental Protocol
# Versão: 1.0

set -e

# Configurações
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
REPORT_FILE="$PROJECT_ROOT/Relatorio_Tecnico_Elemental.md"
PDF_FILE="$PROJECT_ROOT/Relatorio_Tecnico_Elemental.pdf"
BACKUP_DIR="$PROJECT_ROOT/report-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de utilidade
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependências
check_dependencies() {
    log_info "Verificando dependências..."
    
    # Verificar pandoc
    if ! command -v pandoc &> /dev/null; then
        log_error "pandoc não encontrado. Por favor, instale o pandoc."
        log_info "Ubuntu/Debian: sudo apt-get install pandoc"
        log_info "macOS: brew install pandoc"
        exit 1
    fi
    
    # Verificar wkhtmltopdf (fallback)
    if command -v wkhtmltopdf &> /dev/null; then
        export PDF_ENGINE="wkhtmltopdf"
        log_info "Usando wkhtmltopdf para geração de PDF"
    else
        log_warning "wkhtmltopdf não encontrado. Tentando outros engines..."
        export PDF_ENGINE="html"
    fi
    
    log_success "Dependências verificadas"
}

# Criar backup do relatório existente
create_backup() {
    if [ -f "$REPORT_FILE" ]; then
        log_info "Criando backup do relatório existente..."
        mkdir -p "$BACKUP_DIR"
        cp "$REPORT_FILE" "$BACKUP_DIR/Relatorio_Tecnico_Elemental_$TIMESTAMP.md"
        if [ -f "$PDF_FILE" ]; then
            cp "$PDF_FILE" "$BACKUP_DIR/Relatorio_Tecnico_Elemental_$TIMESTAMP.pdf"
        fi
        log_success "Backup criado em $BACKUP_DIR"
    fi
}

# Analisar estrutura do projeto
analyze_project() {
    log_info "Analisando estrutura do projeto..."
    
    cd "$PROJECT_ROOT"
    
    # Verificar se os contratos existem
    local contracts=("ElemToken.sol" "ElemNFT.sol" "ElemStaking.sol" "ElemDAO.sol" "PriceFeed.sol")
    for contract in "${contracts[@]}"; do
        if [ ! -f "contracts/$contract" ]; then
            log_error "Contrato $contract não encontrado em contracts/"
            exit 1
        fi
    done
    
    log_success "Estrutura do projeto validada"
}

# Extrair informações dos contratos
extract_contract_info() {
    log_info "Extraindo informações dos contratos..."
    
    cd "$PROJECT_ROOT"
    
    # Criar arquivo temporário com informações extraídas
    local temp_file=$(mktemp)
    
    # ElemToken
    echo "### ElemToken - Detalhes Adicionais" >> "$temp_file"
    echo "\`\`\`solidity" >> "$temp_file"
    grep -A 5 "contract ElemToken" contracts/ElemToken.sol >> "$temp_file" 2>/dev/null || true
    echo "\`\`\`" >> "$temp_file"
    echo "" >> "$temp_file"
    
    # ElemNFT
    echo "### ElemNFT - Detalhes Adicionais" >> "$temp_file"
    echo "\`\`\`solidity" >> "$temp_file"
    grep -A 5 "contract ElemNFT" contracts/ElemNFT.sol >> "$temp_file" 2>/dev/null || true
    echo "\`\`\`" >> "$temp_file"
    echo "" >> "$temp_file"
    
    # ElemStaking
    echo "### ElemStaking - Detalhes Adicionais" >> "$temp_file"
    echo "\`\`\`solidity" >> "$temp_file"
    grep -A 5 "contract ElemStaking" contracts/ElemStaking.sol >> "$temp_file" 2>/dev/null || true
    echo "\`\`\`" >> "$temp_file"
    echo "" >> "$temp_file"
    
    # ElemDAO
    echo "### ElemDAO - Detalhes Adicionais" >> "$temp_file"
    echo "\`\`\`solidity" >> "$temp_file"
    grep -A 5 "contract ElemDAO" contracts/ElemDAO.sol >> "$temp_file" 2>/dev/null || true
    echo "\`\`\`" >> "$temp_file"
    echo "" >> "$temp_file"
    
    # PriceFeed
    echo "### PriceFeed - Detalhes Adicionais" >> "$temp_file"
    echo "\`\`\`solidity" >> "$temp_file"
    grep -A 5 "contract PriceFeed" contracts/PriceFeed.sol >> "$temp_file"
    echo "\`\`\`" >> "$temp_file"
    echo "" >> "$temp_file"
    
    echo "$temp_file"
}

# Gerar relatório atualizado
generate_report() {
    log_info "Gerando relatório técnico atualizado..."
    
    cd "$PROJECT_ROOT"
    
    # Obter informações do projeto
    local project_name="Elemental Protocol"
    local github_url="https://github.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental"
    local current_date=$(date +"%d de %B de %Y")
    
    # Contar linhas de código
    local total_lines=$(find contracts/ -name "*.sol" -exec wc -l {} + | tail -1 | awk '{print $1}')
    local contract_count=$(find contracts/ -name "*.sol" -not -path "contracts/mocks/*" | wc -l)
    
    # Verificar se há diagramas
    local diagrams_section=""
    if [ -d "docs/diagrams" ]; then
        diagrams_section="![Visão Geral dos Contratos](docs/diagrams/01_visao_geral_contratos.png)"
    fi
    
    # Gerar relatório
    cat > "$REPORT_FILE" << EOF
# Relatório Técnico - Elemental Protocol

## Informações do Projeto

**Nome do Projeto:** Elemental Protocol
**Descrição:** Protocolo descentralizado completo com Token ERC-20, NFT ERC-721, Staking com oráculo e DAO simplificada
**Repositório GitHub:** $github_url
**Linguagem:** Solidity ^0.8.20
**Data de Geração:** $current_date
**Total de Contratos:** $contract_count
**Linhas de Código:** $total_lines

---

## 1. Arquitetura do Sistema

### 1.1 Visão Geral

O Elemental Protocol é um MVP completo de um ecossistema Web3 que integra múltiplos componentes em uma arquitetura coesa e modular. O protocolo demonstra capacidades avançadas de desenvolvimento de smart contracts, incluindo integração com oráculos externos, mecanismos de governança e segurança robusta.

### 1.2 Componentes Principais

\`\`\`
contracts/
  ElemToken.sol      - Token ERC-20 de utilidade (ELEM)
  ElemNFT.sol        - Coleção NFT ERC-721 (Elemental Creatures)
  ElemStaking.sol    - Sistema de staking com recompensas dinâmicas
  ElemDAO.sol        - Contrato de governança simplificada
  PriceFeed.sol      - Wrapper Chainlink para oráculo ETH/USD

ui/                  - Interface web (HTML + ethers.js)
NFT/                 - Assets de pixel art para NFTs
scripts/             - Scripts de deploy e utilitários
\`\`\`

$diagrams_section

---

## 2. Detalhes dos Contratos

### 2.1 ElemToken - Token ERC-20

**Características:**

- **Nome:** Elemental Token
- **Símbolo:** ELEM
- **Supply Máximo:** 1.000.000 tokens
- **Decimais:** 18

**Funcionalidades:**

- Transferência e aprovação padrão ERC-20
- Mint controlado pelo owner (para recompensas de staking)
- Funcionalidade de burn (queima de tokens)
- Pausabilidade para emergências
- Proteção nativa contra overflow (Solidity ^0.8.20)

**Segurança:**

- Herda de OpenZeppelin ERC20, ERC20Burnable, Ownable, Pausable
- Validação de supply máximo
- Controle de acesso restrito para funções administrativas

### 2.2 ElemNFT - Coleção ERC-721

**Características:**

- **Nome:** Elemental Creatures
- **Símbolo:** ECRAFT
- **Supply Máximo:** 10 NFTs únicos
- **Preço de Mint:** 0.01 ETH (configurável)

**Funcionalidades:**

- Mint de NFTs pagando em ETH
- Metadados personalizáveis via tokenURI
- Sistema de enumeração (ERC721Enumerable)
- 10 criaturas pré-definidas com nomes temáticos

**Criaturas Disponíveis:**

1. Fire Elemental
2. Water Spirit
3. Earth Golem
4. Lightning Bolt
5. Shadow Phantom
6. Crystal Gem
7. Solar Flare
8. Toxic Slime
9. Frost Shard
10. Magma Core

**Segurança:**

- Validação de supply máximo
- Controle de preços
- Saque seguro de ETH acumulado

### 2.3 ElemStaking - Sistema de Staking Inteligente

**Características Inovadoras:**

- Recompensas dinâmicas ajustadas pelo preço ETH/USD
- Mecanismo deflacionário quando ETH sobe
- Incentivo aumentado quando ETH cai

**Parâmetros:**

- **Taxa Base:** 1% ao dia (100 base points)
- **Preço Referência:** \$2.000 USD
- **Taxa Mínima:** 0.1% ao dia
- **Taxa Máxima:** 5% ao dia

**Mecânica de Ajuste:**

\`\`\`
Taxa Ajustada = Taxa Base × (Preço Referência / Preço Atual)
\`\`\`

**Funcionalidades:**

- Stake de tokens ELEM
- Cálculo de recompensas em tempo real
- Claim de recompensas acumuladas
- Withdraw parcial ou total
- Visualização de recompensas pendentes

**Segurança:**

- ReentrancyGuard em todas as funções críticas
- SafeERC20 para transferências seguras
- Validação de saldos e amounts
- Atualização atômica de recompensas

### 2.4 ElemDAO - Sistema de Governança

**Parâmetros de Governança:**

- **Período de Votação:** 3 dias (configurável)
- **Quórum Mínimo:** 10% do supply total
- **Peso de Voto:** Proporcional ao saldo de ELEM

**Estados das Propostas:**

- Active
- Approved
- Rejected
- Executed

**Funcionalidades:**

- Criação de propostas (requer posse de ELEM)
- Votação binária (a favor/contra)
- Execução de propostas aprovadas
- Verificação de quórum e maioria

**Segurança:**

- Validação de poder de voto
- Prevenção de voto duplo
- Controle de acesso para execução
- Verificação de estado antes da execução

### 2.5 PriceFeed - Oráculo Chainlink

**Características:**

- Integração com Chainlink Price Feed
- Preço ETH/USD com 8 decimais
- Preço fallback: \$2.000 USD
- Atualização via owner

**Funcionalidades:**

- Obtenção de preço em tempo real
- Tratamento de falhas do oráculo
- Fallback automático
- Configuração de endereço do feed

**Segurança:**

- Try/catch para chamadas externas
- Validação de preços positivos
- Controle de acesso para configuração

---

## 3. Integração Web3

### 3.1 Interface Frontend

**Tecnologias:**

- HTML5 puro
- JavaScript com ethers.js
- CSS moderno
- Servidor estático (http.server)

**Funcionalidades da UI:**

- Conexão com MetaMask
- Visualização de saldos (ELEM, ETH, NFTs)
- Mint de NFTs com preview
- Stake/Unstake de tokens
- Claim de recompensas
- Criação e votação em propostas
- Consulta de preço ETH/USD

![Fluxo de Interações](docs/diagrams/02_fluxo_interacoes.png)

### 3.2 Integração com Backend

**Scripts Disponíveis:**

- Deploy automatizado em Sepolia
- Geração de metadados para NFTs
- Scripts de teste e interação

---

## 4. Segurança e Auditoria

### 4.1 Medidas de Segurança Implementadas

**Proteção contra Ataques Comuns:**

- **Reentrancy:** ReentrancyGuard em contratos críticos
- **Overflow/Underflow:** Solidity ^0.8.20 com verificação nativa
- **Controle de Acesso:** Ownable para funções administrativas
- **Pausabilidade:** Pausable para emergências

**Validações Robustas:**

- Verificação de saldos antes de operações
- Validação de inputs em todas as funções
- Controle de supply máximo
- Verificação de estado em transições

### 4.2 Ferramentas de Auditoria

**Slither:**

- Análise estática automatizada
- Detecção de vulnerabilidades comuns
- Verificação de boas práticas

**Mythril:**

- Análise simbólica
- Detecção de vetores de ataque complexos
- Validação de fluxos de controle

**Hardhat:**

- Ambiente de desenvolvimento completo
- Testes automatizados
- Deploy em múltiplas redes

---

## 5. Deploy e Operação

### 5.1 Ambiente de Deploy

**Rede:** Sepolia Testnet
**Ferramenta:** Hardhat
**Oráculos:** Chainlink ETH/USD

### 5.2 Endereços dos Contratos

*(A ser preenchido após deploy)*

| Contrato    | Endereço | Explorer |
| ----------- | --------- | -------- |
| ElemToken   | 0x...     | [link]   |
| ElemNFT     | 0x...     | [link]   |
| ElemStaking | 0x...     | [link]   |
| ElemDAO     | 0x...     | [link]   |
| PriceFeed   | 0x...     | [link]   |

### 5.3 Processo de Deploy

1. **Setup do Ambiente**

   \`\`\`bash
   npm install
   npx hardhat compile
   \`\`\`

2. **Deploy em Sepolia**

   \`\`\`bash
   npx hardhat run scripts/deploy.js --network sepolia
   \`\`\`

3. **Verificação**

   - Verificar contratos no Etherscan
   - Atualizar endereços na UI
   - Testar funcionalidades

---

## 6. Inovações e Diferenciais

### 6.1 Staking Adaptativo

O sistema de staking implementa um mecanismo inovador que ajusta as recompensas com base no preço do ETH, criando um equilíbrio dinâmico entre incentivos e valor do protocolo.

### 6.2 Governança Simplificada

A DAO implementa um modelo de governança eficiente com quórum baixo (10%) e peso de voto baseado em posse de tokens, permitindo decisões rápidas mantendo descentralização.

### 6.3 Integração Completa

O protocolo demonstra integração completa entre múltiplos componentes Web3, desde tokens fungíveis até oráculos externos, em um ecossistema coeso.

---

## 7. Requisitos Técnicos

### 7.1 Pré-requisitos de Desenvolvimento

- **Node.js:** >= 18
- **MetaMask:** Extensão de navegador
- **ETH de Testnet:** Sepolia faucet
- **Python:** 3.8+ (para auditoria)

### 7.2 Dependências Principais

**JavaScript/Node.js:**

- hardhat
- @openzeppelin/contracts
- @chainlink/contracts
- ethers.js

**Python (Auditoria):**

- slither-analyzer
- mythril

---

## 8. Casos de Uso

### 8.1 Staking com Recompensas Dinâmicas

Usuários podem stake tokens ELEM e receber recompensas que se ajustam automaticamente com base nas condições de mercado, otimizando o rendimento.

### 8.2 Coleção NFT Temática

A coleção de 10 criaturas elementares oferece colecionáveis digitais únicos com metadados personalizáveis e valor estético.

### 8.3 Governança Comunitária

Holders de ELEM podem participar ativamente da governança do protocolo, propondo e votando em mudanças que afetam o ecossistema.

---

## 9. Conclusão

O Elemental Protocol representa um MVP completo e funcional de um ecossistema Web3, demonstrando capacidades avançadas em desenvolvimento de smart contracts, integração com oráculos, e implementação de mecanismos de governança.

O projeto destaca-se por:

- **Arquitetura modular e extensível**
- **Segurança robusta com auditorias múltiplas**
- **Inovação em mecanismos de staking adaptativo**
- **Interface Web3 completa e funcional**
- **Deploy em testnet com verificação**

O protocolo serve como excelente base para evolução futura, podendo incorporar funcionalidades adicionais como farming, yield aggregation, ou integração com outros ecossistemas DeFi.

---

## 10. Referências

- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts
- **Chainlink Documentation:** https://docs.chain.link
- **Hardhat Framework:** https://hardhat.org
- **Ethereum Sepolia Testnet:** https://sepolia.dev
- **Solidity Documentation:** https://docs.soliditylang.org

---

**Data do Relatório:** $current_date
**Autor:** Projeto Elemental Protocol
**Versão:** 1.0
**Gerado por:** script generate-report.sh
EOF

    log_success "Relatório gerado: $REPORT_FILE"
}

# Gerar PDF
generate_pdf() {
    log_info "Gerando PDF do relatório..."
    
    cd "$PROJECT_ROOT"
    
    # Tentar diferentes engines PDF
    if command -v wkhtmltopdf &> /dev/null; then
        log_info "Usando wkhtmltopdf..."
        pandoc "$REPORT_FILE" -o "$PDF_FILE" --pdf-engine=wkhtmltopdf -V geometry:margin=1in -V fontsize=12pt
    elif command -v xelatex &> /dev/null; then
        log_info "Usando xelatex..."
        pandoc "$REPORT_FILE" -o "$PDF_FILE" --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=12pt
    elif command -v pdflatex &> /dev/null; then
        log_info "Usando pdflatex..."
        pandoc "$REPORT_FILE" -o "$PDF_FILE" --pdf-engine=pdflatex -V geometry:margin=1in -V fontsize=12pt
    else
        log_warning "Nenhum engine PDF encontrado. Gerando HTML..."
        pandoc "$REPORT_FILE" -o "${PDF_FILE%.pdf}.html" --standalone --self-contained
        log_info "HTML gerado: ${PDF_FILE%.pdf}.html"
        return 1
    fi
    
    if [ -f "$PDF_FILE" ]; then
        local file_size=$(du -h "$PDF_FILE" | cut -f1)
        log_success "PDF gerado: $PDF_FILE ($file_size)"
    else
        log_error "Falha ao gerar PDF"
        return 1
    fi
}

# Executar auditoria rápida
run_quick_audit() {
    log_info "Executando auditoria rápida..."
    
    cd "$PROJECT_ROOT"
    
    # Verificar sintaxe dos contratos
    if command -v npx &> /dev/null; then
        log_info "Verificando sintaxe com Hardhat..."
        npx hardhat compile > /dev/null 2>&1 && log_success "Compilação bem-sucedida" || log_warning "Erros de compilação encontrados"
    fi
    
    # Contar vulnerabilidades conhecidas
    log_info "Analisando padrões de segurança..."
    local reentrancy_count=$(grep -r "nonReentrant" contracts/ | wc -l)
    local ownable_count=$(grep -r "onlyOwner" contracts/ | wc -l)
    local pause_count=$(grep -r "whenNotPaused\|whenPaused" contracts/ | wc -l)
    
    log_info "Proteções encontradas:"
    log_info "  - ReentrancyGuard: $reentrancy_count ocorrências"
    log_info "  - Ownable: $ownable_count ocorrências"
    log_info "  - Pausable: $pause_count ocorrências"
}

# Limpar arquivos temporários
cleanup() {
    log_info "Limpando arquivos temporários..."
    rm -f /tmp/tmp.* 2>/dev/null || true
}

# Exibir resumo
show_summary() {
    log_info "Resumo da geração:"
    echo "  - Relatório MD: $REPORT_FILE"
    if [ -f "$PDF_FILE" ]; then
        echo "  - Relatório PDF: $PDF_FILE"
    fi
    if [ -d "$BACKUP_DIR" ]; then
        echo "  - Backup em: $BACKUP_DIR"
    fi
    echo ""
    log_success "Relatório técnico gerado com sucesso!"
}

# Função principal
main() {
    echo "========================================"
    echo "  Gerador de Relatório Técnico"
    echo "  Elemental Protocol"
    echo "========================================"
    echo ""
    
    # Executar passos
    check_dependencies
    create_backup
    analyze_project
    generate_report
    generate_pdf || log_warning "PDF não gerado, mas Markdown foi criado"
    run_quick_audit
    cleanup
    show_summary
    
    echo ""
    log_info "Para visualizar o relatório:"
    echo "  Markdown: xdg-open \"$REPORT_FILE\""
    if [ -f "$PDF_FILE" ]; then
        echo "  PDF: xdg-open \"$PDF_FILE\""
    fi
}

# Tratamento de sinais
trap cleanup EXIT

# Executar script
main "$@"
