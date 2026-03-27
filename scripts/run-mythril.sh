#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# run-mythril.sh
# Executa Mythril a partir do ambiente virtual dedicado.
#
# Uso:
#   bash scripts/run-mythril.sh contracts/ElemStaking.sol --solv 0.8.20
#   bash scripts/run-mythril.sh contracts/ --solv 0.8.20  (processa todos os .sol)
#
# Nota: O script automaticamente adiciona os argumentos do solc para resolver
# dependências do OpenZeppelin em node_modules/
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ -x "${PROJECT_DIR}/.venv-mythril/bin/myth" ]]; then
  MYTH_BIN="${PROJECT_DIR}/.venv-mythril/bin/myth"
elif command -v myth >/dev/null 2>&1; then
  MYTH_BIN="$(command -v myth)"
else
  echo "ERRO: Mythril não encontrado. Execute 'bash scripts/setup-mythril-venv.sh' antes de rodar esta análise."
  exit 1
fi

if [[ ! -d "${PROJECT_DIR}/contracts" ]]; then
  echo "ERRO: diretório contracts/ não encontrado na raiz do projeto."
  exit 1
fi

if [[ ! -d "${PROJECT_DIR}/node_modules" ]]; then
  echo "ERRO: node_modules/ não encontrado. Execute 'npm install' antes de rodar o Mythril."
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "Uso: bash scripts/run-mythril.sh <arquivo.sol ou pasta> [argumentos do mythril...]"
  exit 1
fi

if [[ -d "$1" ]]; then
  echo "Processando todos os contratos .sol em: $1"
  cd "${PROJECT_DIR}"
  
  # Compilar todos os contratos com Hardhat
  echo "Compilando contratos com Hardhat..."
  npx hardhat compile
  
  # Encontrar todos os arquivos .sol no diretório
  find "$1" -name "*.sol" -type f | while read -r contract_file; do
    echo "=========================================================="
    echo "Analisando: $contract_file"
    echo "=========================================================="
    
    # Extrair nome do contrato para encontrar o artefato JSON
    contract_name=$(basename "$contract_file" .sol)
    artifact_file="artifacts/contracts/${contract_file#contracts/}/${contract_name}.json"
    
    if [[ -f "$artifact_file" ]]; then
      echo "Extraindo bytecode do artefato compilado: $artifact_file"
      
      # Extrair bytecode do JSON
      bytecode=$(node -e "
        const fs = require('fs');
        const artifact = JSON.parse(fs.readFileSync('$artifact_file', 'utf8'));
        if (artifact.bytecode && typeof artifact.bytecode === 'string') {
          console.log(artifact.bytecode);
        } else {
          process.exit(1);
        }
      ")
      
      if [[ $? -eq 0 && -n "$bytecode" ]]; then
        echo "Analisando bytecode com Mythril..."
        if ! "${MYTH_BIN}" analyze "$bytecode" "${@:2}"; then
          echo "ERRO na análise de: $contract_file"
        fi
      else
        echo "AVISO: Não foi possível extrair bytecode, tentando análise direta..."
        if ! "${MYTH_BIN}" analyze "$contract_file" "${@:2}" --solc-args "--base-path . --include-path node_modules/"; then
          echo "ERRO na análise de: $contract_file"
        fi
      fi
    else
      echo "AVISO: Artefato não encontrado para: $contract_file"
      echo "       Tentando análise direta do arquivo fonte..."
      if ! "${MYTH_BIN}" analyze "$contract_file" "${@:2}" --solc-args "--base-path . --include-path node_modules/"; then
        echo "ERRO na análise de: $contract_file"
      fi
    fi
    echo ""
  done
  exit 0
fi

cd "${PROJECT_DIR}"

# Para arquivos individuais, primeiro compilar com Hardhat
echo "Compilando contrato com Hardhat..."
npx hardhat compile

# Extrair nome do contrato para encontrar o artefato JSON
contract_name=$(basename "$1" .sol)
artifact_file="artifacts/contracts/${1#contracts/}/${contract_name}.json"

if [[ -f "$artifact_file" ]]; then
  echo "Extraindo bytecode do artefato compilado: $artifact_file"
  
  # Extrair bytecode do JSON
  bytecode=$(node -e "
    const fs = require('fs');
    const artifact = JSON.parse(fs.readFileSync('$artifact_file', 'utf8'));
    if (artifact.bytecode && typeof artifact.bytecode === 'string') {
      console.log(artifact.bytecode);
    } else {
      process.exit(1);
    }
  ")
  
  if [[ $? -eq 0 && -n "$bytecode" ]]; then
    echo "Analisando bytecode com Mythril..."
    exec "${MYTH_BIN}" analyze "$bytecode" "${@:2}"
  else
    echo "AVISO: Não foi possível extrair bytecode, tentando análise direta..."
    exec "${MYTH_BIN}" analyze "$@" --solc-args "--base-path . --include-path node_modules/"
  fi
else
  echo "AVISO: Artefato não encontrado, tentando análise direta..."
  exec "${MYTH_BIN}" analyze "$@" --solc-args "--base-path . --include-path node_modules/"
fi
