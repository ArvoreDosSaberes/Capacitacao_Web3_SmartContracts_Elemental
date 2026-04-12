# Script de Geração de Relatório Técnico

## Uso

Executar o script a partir da raiz do projeto:

```bash
./scripts/generate-report.sh
```

## Funcionalidades

### 1. Análise Automática
- Verificação de estrutura do projeto
- Validação de contratos existentes
- Contagem de linhas de código e contratos

### 2. Backup Automático
- Cria backup do relatório existente
- Armazena em `report-backups/` com timestamp

### 3. Geração de Relatório
- Gera relatório técnico completo em Markdown
- Inclui estatísticas atualizadas do projeto
- Formatação profissional e estruturada

### 4. Geração de PDF
- Converte automaticamente para PDF
- Suporta múltiplos engines (wkhtmltopdf, xelatex, pdflatex)
- Fallback para HTML se nenhum PDF engine estiver disponível

### 5. Auditoria Rápida
- Verificação de sintaxe com Hardhat
- Análise de padrões de segurança
- Contagem de proteções implementadas

## Dependências

O script verifica automaticamente as seguintes dependências:

- **pandoc** - Obrigatório para conversão de formatos
- **wkhtmltopdf** - Recomendado para geração de PDF
- **xelatex/pdflatex** - Alternativas para PDF
- **npx/hardhat** - Para verificação de sintaxe

## Instalação de Dependências

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install pandoc wkhtmltopdf texlive-xetex texlive-latex-extra
```

### macOS
```bash
brew install pandoc wkhtmltopdf
```

## Arquivos Gerados

- `Relatorio_Tecnico_Elemental.md` - Relatório em Markdown
- `Relatorio_Tecnico_Elemental.pdf` - Relatório em PDF (se disponível)
- `report-backups/` - Diretório de backups

## Estrutura do Relatório

O relatório gerado inclui:

1. **Informações do Projeto**
   - Nome, descrição, repositório
   - Estatísticas atualizadas

2. **Arquitetura do Sistema**
   - Visão geral e componentes
   - Diagramas (se disponíveis)

3. **Detalhes dos Contratos**
   - Especificações de cada contrato
   - Funcionalidades e segurança

4. **Integração Web3**
   - Frontend e backend
   - Scripts disponíveis

5. **Segurança e Auditoria**
   - Medidas implementadas
   - Ferramentas utilizadas

6. **Deploy e Operação**
   - Ambiente e processos
   - Endereços de contratos

7. **Inovações e Diferenciais**
   - Staking adaptativo
   - Governança simplificada

8. **Requisitos Técnicos**
   - Pré-requisitos e dependências

9. **Casos de Uso**
   - Aplicações práticas do protocolo

10. **Conclusão e Referências**

## Personalização

O script pode ser personalizado modificando:

- Variáveis de configuração no início do script
- Template do relatório na função `generate_report()`
- Critérios de auditoria em `run_quick_audit()`

## Troubleshooting

### PDF não gerado
Verifique se algum engine PDF está instalado:
```bash
which wkhtmltopdf xelatex pdflatex
```

### Erros de compilação
O script continuará mesmo com erros de compilação, mas reportará o problema.

### Permissões negadas
Garanta que o script tenha permissão de execução:
```bash
chmod +x scripts/generate-report.sh
```

## Exemplo de Saída

```
========================================
  Gerador de Relatório Técnico
  Elemental Protocol
========================================

[INFO] Verificando dependências...
[SUCCESS] Dependências verificadas
[INFO] Criando backup do relatório existente...
[SUCCESS] Backup criado em report-backups/
[INFO] Analisando estrutura do projeto...
[SUCCESS] Estrutura do projeto validada
[INFO] Gerando relatório técnico atualizado...
[SUCCESS] Relatório gerado: Relatorio_Tecnico_Elemental.md
[INFO] Gerando PDF do relatório...
[SUCCESS] PDF gerado: Relatorio_Tecnico_Elemental.pdf (552K)
[INFO] Executando auditoria rápida...
[INFO] Proteções encontradas:
[INFO]   - ReentrancyGuard: 3 ocorrências
[INFO]   - Ownable: 10 ocorrências
[INFO]   - Pausable: 1 ocorrências
[SUCCESS] Relatório técnico gerado com sucesso!
```
