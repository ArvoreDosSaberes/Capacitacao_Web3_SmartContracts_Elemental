# Scripts de Aprendizado Hardhat - Elemental Protocol

Este diretório contém scripts interativos para aprender e testar o Hardhat 3 com o Elemental Protocol.

## 📋 Scripts Disponíveis

### 1. Script Principal
- **`hardhat-learning.sh`** - Menu interativo com todas as operações básicas

### 2. Scripts de Verificação
- **`check-sepolia.js`** - Verifica configuração da rede Sepolia
- **`check-address.js`** - Verifica endereço e saldo (já criado anteriormente)

### 3. Scripts de Teste
- **`test-interactive.js`** - Testes básicos dos contratos
- **`lab-contracts.js`** - Laboratório interativo completo

### 4. Scripts de Auditoria
- **`audit-security.js`** - Auditoria de segurança automatizada

## 🚀 Como Usar

### Menu Interativo Principal

```bash
# Tornar executável
chmod +x scripts/hardhat-learning.sh

# Executar menu
./scripts/hardhat-learning.sh

# Ou executar opção específica
./scripts/hardhat-learning.sh 1  # Compilar
./scripts/hardhat-learning.sh 4  # Deploy local
./scripts/hardhat-learning.sh 5  # Deploy Sepolia
```

### Scripts Individuais

```bash
# Verificar configuração Sepolia
npx hardhat run scripts/check-sepolia.js --network sepolia

# Testes interativos (rede local)
npx hardhat run scripts/test-interactive.js --network localhost

# Laboratório completo (rede local)
npx hardhat run scripts/lab-contracts.js --network localhost

# Auditoria de segurança
npx hardhat run scripts/audit-security.js
```

## 📖 Fluxo de Aprendizado Sugerido

### 1. Configuração Inicial
```bash
# 1. Verificar status do projeto
./scripts/hardhat-learning.sh 10

# 2. Compilar contratos
./scripts/hardhat-learning.sh 1

# 3. Executar testes unitários
./scripts/hardhat-learning.sh 2
```

### 2. Desenvolvimento Local
```bash
# 4. Iniciar nó local
./scripts/hardhat-learning.sh 3

# 5. Deploy local
./scripts/hardhat-learning.sh 4

# 6. Testes interativos
npx hardhat run scripts/test-interactive.js --network localhost
```

### 3. Testes Avançados
```bash
# 7. Laboratório completo
npx hardhat run scripts/lab-contracts.js --network localhost

# 8. Auditoria de segurança
npx hardhat run scripts/audit-security.js
```

### 4. Deploy em Testnet
```bash
# 9. Verificar configuração Sepolia
npx hardhat run scripts/check-sepolia.js --network sepolia

# 10. Deploy em Sepolia
./scripts/hardhat-learning.sh 5

# 11. Verificar contratos
./scripts/hardhat-learning.sh 8
```

## 🎯 O que Cada Script Ensina

### `hardhat-learning.sh`
- ✅ Operações básicas do Hardhat
- ✅ Compilação e testes
- ✅ Deploy local e em testnet
- ✅ Verificação de configuração
- ✅ Gerenciamento de projeto

### `check-sepolia.js`
- ✅ Configuração de rede
- ✅ Verificação de saldo
- ✅ Preço de gas
- ✅ Conectividade RPC

### `test-interactive.js`
- ✅ Deploy de contratos
- ✅ Operações básicas
- ✅ Interação entre contratos
- ✅ Tratamento de erros

### `lab-contracts.js`
- ✅ Testes completos
- ✅ Edge cases
- ✅ Operações complexas
- ✅ Validações

### `audit-security.js`
- ✅ Verificação de segurança
- ✅ Análise de dependências
- ✅ Configuração de rede
- ✅ Recomendações

## 🔧 Personalização

### Adicionar Novos Scripts

1. Crie um novo arquivo em `scripts/`
2. Use o template básico:

```javascript
import hre from "hardhat";

async function main() {
  console.log("🚀 Meu Script Personalizado");
  // Seu código aqui
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

3. Execute com:
```bash
npx hardhat run scripts/meu-script.js --network localhost
```

### Adicionar ao Menu Principal

Edite `hardhat-learning.sh` e adicione uma nova opção no `case`:

```bash
15|meu-script)
    echo "🎯 Executando meu script..."
    npx hardhat run scripts/meu-script.js --network localhost
    ;;
```

## 📚 Recursos Adicionais

### Documentação
- [Hardhat 3 Documentation](https://hardhat.org/docs)
- [Viem Documentation](https://viem.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

### Ferramentas Úteis
- **Slither**: `npm run audit:slither`
- **Mythril**: `bash scripts/run-mythril.sh`
- **Coverage**: `npx hardhat coverage`

## 🎓 Dicas de Aprendizado

1. **Comece local**: Sempre teste na rede local primeiro
2. **Entenda os erros**: Leia as mensagens de erro com atenção
3. **Experimente**: Modifique os scripts para testar diferentes cenários
4. **Verifique o código**: Compare os scripts com o código dos contratos
5. **Use o console**: Experimente comandos diretamente no console Hardhat

## 🐛 Solução de Problemas

### Problemas Comuns
1. **Node.js version**: Use `nvm use` para ativar a versão correta
2. **Permissões**: `chmod +x scripts/hardhat-learning.sh`
3. **Compilação**: `./scripts/hardhat-learning.sh 9` para limpar
4. **Rede**: Verifique se o nó local está rodando antes do deploy

### Obter Ajuda
```bash
./scripts/hardhat-learning.sh help
```

---

**🎓 Divirta-se aprendendo Hardhat 3 e Web3!**
