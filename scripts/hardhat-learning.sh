#!/bin/bash

# Scripts de Teste e Aprendizado Hardhat - Elemental Protocol
# Uso: ./scripts/hardhat-learning.sh [opcao]

set -e

echo "🚀 Scripts de Aprendizado Hardhat - Elemental Protocol"
echo "=================================================="

# Função para verificar se o nó local está rodando
check_local_node() {
    if curl -s http://127.0.0.1:8545 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Função para mostrar menu de ajuda
show_help() {
    echo "Uso: $0 [opcao]"
    echo ""
    echo "Opções disponíveis:"
    echo "  1, compile     Compilar contratos"
    echo "  2, test        Executar testes"
    echo "  3, node        Iniciar nó local"
    echo "  4, deploy-local Deploy local (localhost)"
    echo "  5, deploy-sepolia Deploy em Sepolia"
    echo "  6, console-local Abrir console local"
    echo "  7, console-sepolia Abrir console Sepolia"
    echo "  8, verify      Verificar contratos no Etherscan"
    echo "  9, clean       Limpar artefatos"
    echo "  10, status     Verificar status do projeto"
    echo "  11, accounts   Verificar contas configuradas"
    echo "  12, balance    Verificar saldo Sepolia"
    echo "  13, gas        Estimar gas de deploy"
    echo "  14, reset      Reset completo do projeto"
    echo "  h, help        Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 1           # Compilar contratos"
    echo "  $0 compile     # Compilar contratos"
    echo "  $0 4           # Deploy local"
}

# Função para compilar contratos
compile_contracts() {
    echo "📦 Compilando contratos..."
    npx hardhat compile
    echo "✅ Compilação concluída!"
}

# Função para executar testes
run_tests() {
    echo "🧪 Executando testes..."
    npx hardhat test
    echo "✅ Testes concluídos!"
}

# Função para iniciar nó local
start_local_node() {
    echo "🌐 Iniciando nó local Hardhat..."
    if check_local_node; then
        echo "⚠️  Nó local já está rodando em http://127.0.0.1:8545"
        echo "   Use 'curl http://127.0.0.1:8545' para testar"
    else
        echo "   Iniciando nó local..."
        npx hardhat node
    fi
}

# Função para deploy local
deploy_local() {
    echo "🏠 Deploy local..."
    
    if ! check_local_node; then
        echo "❌ Nó local não está rodando!"
        echo "   Inicie o nó local primeiro: $0 3"
        exit 1
    fi
    
    echo "   Deployando contratos em localhost..."
    npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network localhost
    echo "✅ Deploy local concluído!"
}

# Função para deploy em Sepolia
deploy_sepolia() {
    echo "🌍 Deploy em Sepolia..."
    
    echo "   Verificando configuração..."
    if ! npx hardhat keystore list | grep -q "SEPOLIA_RPC_URL"; then
        echo "❌ SEPOLIA_RPC_URL não configurado!"
        echo "   Configure com: npx hardhat keystore set SEPOLIA_RPC_URL"
        exit 1
    fi
    
    if ! npx hardhat keystore list | grep -q "SEPOLIA_PRIVATE_KEY"; then
        echo "❌ SEPOLIA_PRIVATE_KEY não configurado!"
        echo "   Configure com: npx hardhat keystore set SEPOLIA_PRIVATE_KEY"
        exit 1
    fi
    
    echo "   Deployando contratos em Sepolia..."
    npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network sepolia
    echo "✅ Deploy em Sepolia concluído!"
}

# Função para console local
console_local() {
    echo "💻 Console local..."
    
    if ! check_local_node; then
        echo "❌ Nó local não está rodando!"
        echo "   Inicie o nó local primeiro: $0 3"
        exit 1
    fi
    
    echo "   Abrindo console Hardhat para localhost..."
    npx hardhat console --network localhost
}

# Função para console Sepolia
console_sepolia() {
    echo "💻 Console Sepolia..."
    echo "   Abrindo console Hardhat para Sepolia..."
    npx hardhat console --network sepolia
}

# Função para verificar contratos
verify_contracts() {
    echo "🔍 Verificar contratos no Etherscan..."
    
    if ! npx hardhat keystore list | grep -q "ETHERSCAN_API_KEY"; then
        echo "❌ ETHERSCAN_API_KEY não configurada!"
        echo "   Configure com: npx hardhat keystore set ETHERSCAN_API_KEY"
        exit 1
    fi
    
    echo "   Para verificar um contrato específico:"
    echo "   npx hardhat verify --network sepolia <ENDEREÇO> <ARG1> <ARG2>"
    echo ""
    echo "   Exemplo para ElemToken:"
    echo "   npx hardhat verify --network sepolia 0xENDEREÇO 0xOWNER_ADDRESS"
}

# Função para limpar artefatos
clean_project() {
    echo "🧹 Limpando artefatos..."
    npx hardhat clean
    echo "✅ Artefatos limpos!"
}

# Função para verificar status do projeto
check_status() {
    echo "📊 Status do Projeto"
    echo "=================="
    
    echo "📁 Node.js:"
    node --version
    echo ""
    
    echo "📦 NPM:"
    npm --version
    echo ""
    
    echo "🔧 Hardhat:"
    npx hardhat --version
    echo ""
    
    echo "📋 Variáveis Keystore:"
    npx hardhat keystore list
    echo ""
    
    echo "🌐 Nó Local:"
    if check_local_node; then
        echo "   ✅ Rodando em http://127.0.0.1:8545"
    else
        echo "   ❌ Não está rodando"
    fi
    echo ""
    
    echo "📦 Contratos compilados:"
    if [ -d "artifacts" ] && [ "$(ls -A artifacts)" ]; then
        echo "   ✅ Contratos compilados encontrados"
        ls -1 artifacts/contracts/*/ | grep -o '[^/]*\.json$' | head -5
    else
        echo "   ❌ Nenhum contrato compilado"
    fi
}

# Função para verificar contas
check_accounts() {
    echo "👥 Verificando Contas"
    echo "=================="
    
    echo "📋 Keystore configurado:"
    npx hardhat keystore list
    echo ""
    
    echo "🌐 Testando conexão Sepolia..."
    if timeout 10 npx hardhat console --network sepolia -c "console.log('Conectado!')" 2>/dev/null; then
        echo "   ✅ Conexão Sepolia OK"
    else
        echo "   ❌ Erro na conexão Sepolia"
    fi
}

# Função para verificar saldo
check_balance() {
    echo "💰 Verificar Saldo Sepolia"
    echo "========================="
    
    echo "   Para verificar saldo, use o script:"
    echo "   npx hardhat run scripts/check-balance.js --network sepolia"
    echo ""
    echo "   Ou deploy um contrato (mostrará o endereço):"
    echo "   $0 5"
}

# Função para estimar gas
estimate_gas() {
    echo "⛽ Estimativa de Gas"
    echo "=================="
    
    echo "   Estimando gas para deploy..."
    npx hardhat ignition deploy ignition/modules/ElementalProtocol.ts --network localhost --dry-run
}

# Função para reset completo
reset_project() {
    echo "🔄 Reset Completo do Projeto"
    echo "==========================="
    
    echo "   ⚠️  Isso irá limpar todos os artefatos e cache"
    read -p "   Continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Limpando projeto..."
        npx hardhat clean
        rm -rf node_modules
        npm install
        npx hardhat compile
        echo "✅ Reset concluído!"
    else
        echo "   ❌ Reset cancelado"
    fi
}

# Processar argumentos
case "${1:-}" in
    1|compile)
        compile_contracts
        ;;
    2|test)
        run_tests
        ;;
    3|node)
        start_local_node
        ;;
    4|deploy-local)
        deploy_local
        ;;
    5|deploy-sepolia)
        deploy_sepolia
        ;;
    6|console-local)
        console_local
        ;;
    7|console-sepolia)
        console_sepolia
        ;;
    8|verify)
        verify_contracts
        ;;
    9|clean)
        clean_project
        ;;
    10|status)
        check_status
        ;;
    11|accounts)
        check_accounts
        ;;
    12|balance)
        check_balance
        ;;
    13|gas)
        estimate_gas
        ;;
    14|reset)
        reset_project
        ;;
    h|help|"")
        show_help
        ;;
    *)
        echo "❌ Opção inválida: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
