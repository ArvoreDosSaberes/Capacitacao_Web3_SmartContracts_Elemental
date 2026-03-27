[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Avancado_docs_Trilha1.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Avancado_docs_Trilha1)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?logo=solidity)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![Chainlink](https://img.shields.io/badge/Chainlink-Oracle-375BD2?logo=chainlink)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)

# Desenvolvimento de Protocolo Web3 Completo com Deploy em Testnet

**Unidade 1 | Capítulo 5**
**Prof.: Bruno Portes**

---

## Objetivo

Consolidar conhecimentos avançados por meio da construção de um **MVP completo**.

## Enunciado

Você deverá desenvolver um MVP funcional de um protocolo descentralizado, integrando todos os conteúdos estudados na Fase 2 Avançada.

O protocolo deverá conter:

- Token ERC-20
- NFT (ERC-721 ou ERC-1155)
- Contrato de Staking
- Mecanismo básico de Governança (DAO simplificada)
- Integração com oráculo
- Integração com backend Web3
- Deploy em testnet

---

## Instruções (Passo a Passo)

### Etapa 1 – Modelagem

- Definir o problema que o protocolo resolve.
- Criar diagrama de arquitetura (contratos + fluxo).
- Justificar escolha dos padrões ERC.

### Etapa 2 – Implementação

Desenvolver:

- Token ERC-20 utilizando biblioteca da OpenZeppelin
- NFT ERC-721 ou ERC-1155
- Contrato de Staking com recompensa
- Contrato de Governança simples

### Etapa 3 – Segurança

Aplicar:

- Proteção contra reentrancy
- Controle de acesso
- Uso de Solidity ^0.8.x

Executar auditoria usando:

- Slither
- Mythril
- Hardhat

Entregar relatório simples de auditoria.

### Etapa 4 – Oráculo

Integrar consumo de dados externos utilizando:

- Chainlink ou API3

Exemplo: utilizar preço ETH/USD para ajustar recompensa de staking.

### Etapa 5 – Integração Web3

Criar script ou mini frontend utilizando:

- ethers.js
- ou web3.py

Demonstrar:

- Mint de NFT
- Stake de tokens
- Votação na DAO

### Etapa 6 – Deploy

Deploy obrigatório em:

- Sepolia ou outra testnet Ethereum

Entregar:

- Endereço dos contratos
- Link do explorer
- README explicativo

---

## Formato de Entrega

O aluno deverá enviar:

1. Relatório técnico em PDF
2. Link do GitHub
3. Vídeo demonstrativo (5–10 minutos)
4. Relatório de auditoria

**Nome do Arquivo:** `U1C5O1T1_NomeSobrenome.pdf`

---

## Critérios de Avaliação (Rubrica)

| Critério                  | Peso |
|---------------------------|------|
| Arquitetura e Modelagem   | 20%  |
| Implementação Técnica     | 20%  |
| Segurança                 | 20%  |
| Integração Oráculo        | 10%  |
| Integração Web3           | 10%  |
| Deploy em Testnet         | 10%  |
| Clareza do Relatório      | 10%  |

**Nota final** = soma ponderada.
