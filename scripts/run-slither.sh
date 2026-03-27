#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ -x "${PROJECT_DIR}/.venv/bin/slither" ]]; then
  SLITHER_BIN="${PROJECT_DIR}/.venv/bin/slither"
elif command -v slither >/dev/null 2>&1; then
  SLITHER_BIN="$(command -v slither)"
else
  echo "ERRO: Slither não encontrado. Execute 'bash scripts/setup-python-venv.sh' antes de rodar esta análise."
  exit 1
fi

if [[ ! -d "${PROJECT_DIR}/contracts" ]]; then
  echo "ERRO: diretório contracts/ não encontrado na raiz do projeto."
  exit 1
fi

if [[ ! -d "${PROJECT_DIR}/node_modules" ]]; then
  echo "ERRO: node_modules/ não encontrado. Execute 'npm install' antes de rodar o Slither."
  exit 1
fi

cd "${PROJECT_DIR}"

# Garantir que estamos usando Node.js 22.16.0
if command -v nvm >/dev/null 2>&1; then
  nvm use >/dev/null 2>&1 || true
fi

# Limpar e compilar com Hardhat antes de rodar Slither
npx hardhat clean --silent >/dev/null 2>&1 || npx hardhat clean >/dev/null 2>&1 || true
npx hardhat compile --silent >/dev/null 2>&1 || npx hardhat compile >/dev/null 2>&1 || true

exec "${SLITHER_BIN}" . "$@"
