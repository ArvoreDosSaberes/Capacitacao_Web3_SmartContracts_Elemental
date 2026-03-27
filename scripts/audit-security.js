import hre from "hardhat";

async function main() {
  console.log("🔍 Auditoria de Segurança - Elemental Protocol");
  console.log("============================================");

  const issues = [];
  const warnings = [];
  const recommendations = [];

  console.log("🔍 Analisando configuração do projeto...\n");

  // 1. Verificar variáveis de ambiente
  console.log("🔧 1. Verificando configuração de keystore");
  const keystoreVars = await hre.run("keystore:list");
  
  if (!keystoreVars.includes("SEPOLIA_PRIVATE_KEY")) {
    warnings.push("SEPOLIA_PRIVATE_KEY não configurado");
  }
  
  if (!keystoreVars.includes("SEPOLIA_RPC_URL")) {
    warnings.push("SEPOLIA_RPC_URL não configurado");
  }

  // 2. Verificar compilação
  console.log("📦 2. Verificando compilação dos contratos");
  try {
    await hre.run("compile");
    console.log("✅ Contratos compilados com sucesso");
  } catch (error) {
    issues.push("Erro na compilação dos contratos");
    console.log("❌ Erro na compilação:", error.message);
  }

  // 3. Análise dos contratos
  console.log("\n🔍 3. Análise de segurança dos contratos");
  
  try {
    // Deploy para análise
    const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    // Analisar ElemToken
    console.log("   🪙 Analisando ElemToken...");
    const elemToken = await hre.viem.deployContract("ElemToken", [owner]);
    
    // Verificar se tem pausa
    try {
      const paused = await elemToken.read.paused();
      console.log("      ✅ Mecanismo de pausa encontrado");
    } catch (error) {
      warnings.push("ElemToken não tem mecanismo de pausa");
    }
    
    // Verificar se tem owner
    try {
      const ownerAddr = await elemToken.read.owner();
      console.log(`      ✅ Owner configurado: ${ownerAddr}`);
    } catch (error) {
      recommendations.push("Considere adicionar ownership ao ElemToken");
    }

    // Analisar ElemNFT
    console.log("   🖼️  Analisando ElemNFT...");
    const elemNFT = await hre.viem.deployContract("ElemNFT", [owner]);
    
    // Verificar MAX_SUPPLY
    try {
      const maxSupply = await elemNFT.read.MAX_SUPPLY();
      console.log(`      ✅ MAX_SUPPLY configurado: ${maxSupply}`);
    } catch (error) {
      issues.push("ElemNFT não tem MAX_SUPPLY configurado");
    }
    
    // Verificar preço de mint
    try {
      const mintPrice = await elemNFT.read.MINT_PRICE();
      console.log(`      ✅ Preço de mint configurado: ${mintPrice}`);
    } catch (error) {
      warnings.push("ElemNFT não tem preço de mint configurado");
    }

    // Analisar ElemStaking
    console.log("   🔒 Analisando ElemStaking...");
    
    // Deploy dependências
    const priceFeed = await hre.viem.deployContract("PriceFeed", [
      "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      owner
    ]);
    
    const elemStaking = await hre.viem.deployContract("ElemStaking", [
      elemToken.address,
      priceFeed.address,
      owner
    ]);
    
    // Verificar se tem controle de acesso
    try {
      const stakingOwner = await elemStaking.read.owner();
      console.log(`      ✅ Owner configurado: ${stakingOwner}`);
    } catch (error) {
      issues.push("ElemStaking não tem controle de acesso");
    }

  } catch (error) {
    issues.push("Erro na análise dos contratos: " + error.message);
  }

  // 4. Verificar dependências
  console.log("\n📚 4. Verificando dependências");
  
  try {
    const packageJson = require("../package.json");
    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};
    
    // Verificar OpenZeppelin
    if (deps["@openzeppelin/contracts"]) {
      console.log(`      ✅ OpenZeppelin Contracts: ${deps["@openzeppelin/contracts"]}`);
    } else {
      issues.push("OpenZeppelin Contracts não encontrado");
    }
    
    // Verificar Chainlink
    if (deps["@chainlink/contracts"]) {
      console.log(`      ✅ Chainlink Contracts: ${deps["@chainlink/contracts"]}`);
    } else {
      warnings.push("Chainlink Contracts não encontrado");
    }
    
  } catch (error) {
    warnings.push("Não foi possível verificar dependências");
  }

  // 5. Verificar configuração de rede
  console.log("\n🌐 5. Verificando configuração de rede");
  
  try {
    const config = hre.config;
    if (config.networks.sepolia) {
      console.log("      ✅ Rede Sepolia configurada");
      
      if (config.networks.sepolia.url) {
        console.log("      ✅ URL RPC configurada");
      } else {
        warnings.push("URL RPC não configurada para Sepolia");
      }
      
      if (config.networks.sepolia.accounts) {
        console.log("      ✅ Contas configuradas");
      } else {
        issues.push("Contas não configuradas para Sepolia");
      }
    } else {
      issues.push("Rede Sepolia não configurada");
    }
  } catch (error) {
    warnings.push("Não foi possível verificar configuração de rede");
  }

  // 6. Verificar testes
  console.log("\n🧪 6. Verificando testes");
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const testDir = path.join(__dirname, '../test');
    const testFiles = fs.readdirSync(testDir);
    
    console.log(`      📁 Encontrados ${testFiles.length} arquivos de teste`);
    
    testFiles.forEach(file => {
      if (file.endsWith('.ts')) {
        console.log(`      ✅ ${file}`);
      }
    });
    
  } catch (error) {
    warnings.push("Não foi possível verificar testes");
  }

  // Relatório final
  console.log("\n📊 RELATÓRIO DE AUDITORIA");
  console.log("========================");
  
  if (issues.length > 0) {
    console.log("\n❌ ISSUES CRÍTICOS:");
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log("\n⚠️  AVISOS:");
    warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
  }
  
  if (recommendations.length > 0) {
    console.log("\n💡 RECOMENDAÇÕES:");
    recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  // Score de segurança
  const totalChecks = 10;
  const passedChecks = totalChecks - issues.length - (warnings.length * 0.5);
  const securityScore = Math.max(0, Math.round((passedChecks / totalChecks) * 100));
  
  console.log(`\n🎯 SCORE DE SEGURANÇA: ${securityScore}%`);
  
  if (securityScore >= 80) {
    console.log("✅ Projeto com boa segurança");
  } else if (securityScore >= 60) {
    console.log("⚠️  Projeto precisa de melhorias");
  } else {
    console.log("❌ Projeto com problemas de segurança");
  }
  
  console.log("\n🔧 Próximos passos recomendados:");
  console.log("   1. Corrigir issues críticas identificadas");
  console.log("   2. Implementar recomendações");
  console.log("   3. Executar testes completos");
  console.log("   4. Considerar auditoria profissional");
  
  console.log("\n🎓 Auditoria concluída!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
