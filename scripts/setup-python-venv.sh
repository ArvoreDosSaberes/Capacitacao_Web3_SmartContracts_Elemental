#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# setup-python-venv.sh
# Ativa o ambiente virtual do Python e instala as dependências
# compartilhadas do Slither somente quando os arquivos de requirements mudarem.
#
# Uso:
#   bash scripts/setup-python-venv.sh
#
# Comportamento:
# - Procura um ambiente virtual em .venv/ ou venv/
# - Ativa o venv encontrado
# - Procura arquivos de requirements comuns
# - Instala as dependências apenas se os arquivos tiverem mudado
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

VENV_DIR=""
for candidate in "${PROJECT_DIR}/.venv" "${PROJECT_DIR}/venv"; do
  if [[ -f "${candidate}/bin/activate" ]]; then
    VENV_DIR="${candidate}"
    break
  fi
done

if [[ -z "${VENV_DIR}" ]]; then
  echo "ERRO: Nenhum ambiente virtual encontrado."
  echo "Crie um venv em .venv/ ou venv/ antes de executar este script."
  exit 1
fi

# shellcheck disable=SC1090
source "${VENV_DIR}/bin/activate"

python -m pip install --upgrade pip setuptools wheel

if python -m pip show mythril >/dev/null 2>&1; then
  echo "Removendo Mythril do ambiente compartilhado para evitar conflito com Slither..."
  python -m pip uninstall -y mythril
fi

REQUIREMENTS_FILES=()
for file in \
  "${PROJECT_DIR}/requirements.txt" \
  "${PROJECT_DIR}/requirements-dev.txt" \
  "${PROJECT_DIR}/requirements-devops.txt" \
  "${PROJECT_DIR}/requirements-test.txt" \
  "${PROJECT_DIR}/requirements/requirements.txt"; do
  if [[ -f "${file}" ]]; then
    REQUIREMENTS_FILES+=("${file}")
  fi
done

if [[ ${#REQUIREMENTS_FILES[@]} -eq 0 ]]; then
  echo "Nenhum arquivo de requirements encontrado."
  echo "Venv ativado em: ${VENV_DIR}"
  exit 0
fi

STATE_FILE="${VENV_DIR}/.requirements.sha256"
CURRENT_STATE="$(mktemp)"
trap 'rm -f "${CURRENT_STATE}"' EXIT

sha256sum "${REQUIREMENTS_FILES[@]}" | sort -k 2 > "${CURRENT_STATE}"

if [[ -f "${STATE_FILE}" ]] && cmp -s "${CURRENT_STATE}" "${STATE_FILE}"; then
  echo "Dependências já estão atualizadas."
  echo "Venv ativado em: ${VENV_DIR}"
  exit 0
fi

echo "Instalando/atualizando dependências..."
python -m pip install --upgrade pip
python -m pip install -r "${REQUIREMENTS_FILES[0]}"

for extra_requirements in "${REQUIREMENTS_FILES[@]:1}"; do
  python -m pip install -r "${extra_requirements}"
done

cp "${CURRENT_STATE}" "${STATE_FILE}"

echo "Dependências instaladas com sucesso."
echo "Venv ativado em: ${VENV_DIR}"
