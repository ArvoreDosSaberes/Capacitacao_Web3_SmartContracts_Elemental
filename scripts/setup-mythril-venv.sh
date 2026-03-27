#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# setup-mythril-venv.sh
# Cria um ambiente virtual dedicado ao Mythril e instala suas
# dependências sem conflitar com o ambiente do Slither.
#
# Uso:
#   bash scripts/setup-mythril-venv.sh
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
VENV_DIR="${PROJECT_DIR}/.venv-mythril"
REQUIREMENTS_FILE="${PROJECT_DIR}/requirements-mythril.txt"

if [[ ! -f "${REQUIREMENTS_FILE}" ]]; then
  echo "ERRO: arquivo requirements-mythril.txt não encontrado na raiz do projeto."
  exit 1
fi

if [[ ! -f "${VENV_DIR}/bin/activate" ]]; then
  python3 -m venv "${VENV_DIR}"
fi

# shellcheck disable=SC1090
source "${VENV_DIR}/bin/activate"

python -m pip install --upgrade pip wheel "setuptools<82"

STATE_FILE="${VENV_DIR}/.requirements.sha256"
CURRENT_STATE="$(mktemp)"
trap 'rm -f "${CURRENT_STATE}"' EXIT

sha256sum "${REQUIREMENTS_FILE}" > "${CURRENT_STATE}"

if [[ -f "${STATE_FILE}" ]] && cmp -s "${CURRENT_STATE}" "${STATE_FILE}"; then
  echo "Dependências do Mythril já estão atualizadas."
  echo "Venv ativado em: ${VENV_DIR}"
  exit 0
fi

echo "Instalando/atualizando dependências do Mythril..."
python -m pip install -r "${REQUIREMENTS_FILE}"
cp "${CURRENT_STATE}" "${STATE_FILE}"

echo "Dependências do Mythril instaladas com sucesso."
echo "Venv ativado em: ${VENV_DIR}"
