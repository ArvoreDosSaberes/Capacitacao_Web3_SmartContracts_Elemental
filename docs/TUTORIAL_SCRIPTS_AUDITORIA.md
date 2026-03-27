# Tutorial de Uso dos Scripts de Auditoria

Este tutorial explica como usar os novos scripts de auditoria de segurança do projeto Elemental Protocol.

## 📋 Pré-requisitos

- Node.js 22.16.0 ou superior
- Python 3.8 ou superior
- npm instalado

## 🚀 Configuração Inicial

### 1. Instalar Dependências Python

#### Para Slither (ambiente compartilhado)
```bash
bash scripts/setup-python-venv.sh
```

#### Para Mythril (ambiente dedicado)
```bash
bash scripts/setup-mythril-venv.sh
```

### 2. Instalar Dependências Node.js
```bash
npm install
```

## 🔍 Executar Análises

### Slither - Análise Estática

#### Análise Completa do Projeto
```bash
npm run audit:slither
# ou
bash scripts/run-slither.sh
```

#### Análise de Contrato Específico
```bash
bash scripts/run-slither.sh contracts/ElemStaking.sol
```

### Mythril - Análise Simbólica

#### Análise de Contrato Individual
```bash
npm run audit:mythril -- contracts/ElemStaking.sol --solv 0.8.20
# ou
bash scripts/run-mythril.sh contracts/ElemStaking.sol --solv 0.8.20
```

#### Análise de Todos os Contratos na Pasta
```bash
bash scripts/run-mythril.sh contracts/ --solv 0.8.20
```

## 📁 Estrutura de Arquivos

### Scripts Principais
- `scripts/setup-python-venv.sh` - Configura ambiente para Slither
- `scripts/setup-mythril-venv.sh` - Configura ambiente para Mythril
- `scripts/run-slither.sh` - Executa análise com Slither
- `scripts/run-mythril.sh` - Executa análise com Mythril

### Requirements
- `requirements.txt` - Dependências Python base
- `requirements-dev.txt` - Dependências de desenvolvimento (inclui Slither)
- `requirements-mythril.txt` - Dependências específicas do Mythril

### Ambientes Virtuais
- `.venv/` - Ambiente virtual do Slither e utilitários compartilhados
- `.venv-mythril/` - Ambiente virtual dedicado ao Mythril

## 🔧 Argumentos Comuns

### Para Mythril
- `--solv 0.8.20` - Versão do Solidity
- `--solv 0.8.28` - Versão atual do projeto
- `--execution-timeout 30` - Timeout de execução em segundos
- `--depth 2` - Profundidade da análise

### Para Slither
- `--filter medium` - Filtra vulnerabilidades de nível médio ou superior
- `--filter high` - Apenas vulnerabilidades de nível alto
- `--json results.json` - Exporta resultados em JSON

## 📊 Exemplos de Uso

### Auditoria Completa do Projeto
```bash
# 1. Configurar ambientes
bash scripts/setup-python-venv.sh
bash scripts/setup-mythril-venv.sh

# 2. Executar Slither
npm run audit:slither

# 3. Executar Mythril em todos os contratos
bash scripts/run-mythril.sh contracts/ --solv 0.8.28
```

### Análise Focada em um Contrato
```bash
# Analisar ElemStaking.sol com ambas as ferramentas
bash scripts/run-slither.sh contracts/ElemStaking.sol
bash scripts/run-mythril.sh contracts/ElemStaking.sol --solv 0.8.28
```

### Gerar Relatórios
```bash
# Relatório Slither em JSON
bash scripts/run-slither.sh --json slither-report.json

# Relatório Mythril em JSON
bash scripts/run-mythril.sh contracts/ --solv 0.8.28 -o jsonv2 > mythril-report.json
```

## 🐛 Solução de Problemas

### Problema: "No module named 'pkg_resources'"
**Solução**: Reinstalar o ambiente Mythril
```bash
bash scripts/setup-mythril-venv.sh
```

### Problema: Node.js versão incorreta
**Solução**: Usar versão correta
```bash
nvm use
```

### Problema: "No contracts to compile"
**Solução**: Limpar cache e recompilar
```bash
rm -rf cache/ artifacts/ build/
npx hardhat compile
```

### Problema: Slither não encontra imports
**Solução**: Executar a partir da raiz do projeto
```bash
bash scripts/run-slither.sh
# Não especificar subdiretório
```

## 🎯 Dicas de Uso

1. **Sempre use Node.js 22.16.0+** para compatibilidade com Hardhat
2. **Mythril é mais lento** mas encontra vulnerabilidades que Slither não detecta
3. **Slither é mais rápido** ideal para análise contínua durante desenvolvimento
4. **Use ambos os tools** para auditoria completa
5. **Analise bytecode compilado** em vez de código fonte para melhores resultados

## 📝 Fluxo de Trabalho Recomendado

### Durante Desenvolvimento
```bash
# Análise rápida com Slither
npm run audit:slither
```

### Para Auditoria de Segurança
```bash
# Análise completa com ambos os tools
npm run audit:slither
bash scripts/run-mythril.sh contracts/ --solv 0.8.28
```

### Antes de Deploy
```bash
# Verificar todos os contratos individualmente
for contract in contracts/*.sol; do
  echo "Analisando $contract"
  bash scripts/run-mythril.sh "$contract" --solv 0.8.28
done
```

## 🚨 Considerações de Segurança

- **Mythril usa análise simbólica** - pode levar mais tempo em contratos complexos
- **Slither usa análise estática** - mais rápido mas menos completo
- **Ambientes separados** evitam conflitos de dependências
- **Sempre verifique manualmente** os achados das ferramentas automatizadas

## 📚 Referências

- [Documentação Slither](https://github.com/crytic/slither)
- [Documentação Mythril](https://github.com/ConsenSys/mythril)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Nota**: Este tutorial assume que você está na raiz do projeto Elemental Protocol.
