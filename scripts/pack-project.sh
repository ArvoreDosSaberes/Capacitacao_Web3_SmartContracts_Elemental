#!/usr/bin/env bash
# ============================================================
# pack-project.sh
# Gera um arquivo .zip com todo o conteúdo relevante do projeto
# para que outro usuário possa descompactar, instalar as
# dependências e implantar o projeto.
#
# Uso:
#   bash scripts/pack-project.sh [nome_do_arquivo]
#
# Se nenhum nome for informado, o arquivo será gerado como:
#   smartcontracts_YYYYMMDD_HHMMSS.zip
# ============================================================

set -euo pipefail

# Diretório raiz do projeto (um nível acima de scripts/)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

# Nome do arquivo de saída
if [[ -n "${1:-}" ]]; then
  OUTPUT_FILE="$1"
else
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  OUTPUT_FILE="${PROJECT_DIR}/${PROJECT_NAME}_${TIMESTAMP}.zip"
fi

# Garante caminho absoluto para o arquivo de saída
case "$OUTPUT_FILE" in
  /*) ;; # já é absoluto
  *)  OUTPUT_FILE="${PROJECT_DIR}/${OUTPUT_FILE}" ;;
esac

echo "========================================"
echo " Empacotando projeto: ${PROJECT_NAME}"
echo " Diretório: ${PROJECT_DIR}"
echo " Destino:   ${OUTPUT_FILE}"
echo "========================================"

# Verifica se o comando zip está disponível
if ! command -v zip &> /dev/null; then
  echo "ERRO: O comando 'zip' não está instalado."
  echo "Instale com: sudo apt install zip (Debian/Ubuntu)"
  exit 1
fi

# Remove zip anterior com mesmo nome, se existir
[[ -f "$OUTPUT_FILE" ]] && rm -f "$OUTPUT_FILE"

# Cria o zip a partir do diretório pai, usando o nome da pasta como raiz
cd "$(dirname "$PROJECT_DIR")"

zip -r "$OUTPUT_FILE" "$PROJECT_NAME" \
  -x "${PROJECT_NAME}/.git/*" \
  -x "${PROJECT_NAME}/node_modules/*" \
  -x "${PROJECT_NAME}/artifacts/*" \
  -x "${PROJECT_NAME}/cache/*" \
  -x "${PROJECT_NAME}/types/*" \
  -x "${PROJECT_NAME}/coverage/*" \
  -x "${PROJECT_NAME}/dist/*" \
  -x "${PROJECT_NAME}/bundle/*" \
  -x "${PROJECT_NAME}/.venv/*" \
  -x "${PROJECT_NAME}/.venv-mythril/*" \
  -x "${PROJECT_NAME}/*.zip"

echo ""
echo "========================================"
echo " Arquivo gerado com sucesso!"
echo " ${OUTPUT_FILE}"
echo " Tamanho: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "========================================"
echo ""
echo "Instruções para o destinatário:"
echo "  1. Descompacte: unzip $(basename "$OUTPUT_FILE")"
echo "  2. Entre na pasta: cd ${PROJECT_NAME}"
echo "  3. Instale dependências: npm install"
echo "  4. Compile os contratos: npm run compile"
echo "  5. Execute os testes: npm run test"
echo "  6. Deploy local: npm run deploy:local"
echo "  7. Deploy Sepolia: npm run deploy:sepolia"
echo "========================================"
