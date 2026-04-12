[![Visits](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_REQUISITOS.svg?style=flat-square&show=unique)](https://hits.dwyl.com/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental_REQUISITOS)

# REQUISITOS – Protocolo Web3 Completo (MVP)

## Visão Geral

Bem-vindo ao **Elemental Protocol**, um ecossistema Web3 completo desenvolvido como Produto Mínimo Viável (MVP) que demonstra na prática os principais conceitos de desenvolvimento de protocolos descentralizados na blockchain Ethereum. Este projeto combina de forma inteligente e integrada quatro pilares fundamentais do universo DeFi: um **token fungível ERC-20** que serve como moeda nativa do ecossistema, uma **coleção exclusiva de NFTs ERC-721** com arte pixel autêntica, um **sistema de staking dinâmico** com recompensas ajustadas automaticamente por oráculos externos, e uma **DAO (Organização Autônoma Descentralizada)** simplificada para governança comunitária. Todo o protocolo será deployado na rede de testes Sepolia, permitindo experimentação segura e realista sem custos financeiros reais.

---

## 1. Problema que o Protocolo Resolve

O **Elemental Protocol** foi concebido para resolver um desafio central no ecossistema Web3 atual: como criar um ambiente verdadeiramente gamificado e interativo que demonstre na prática a sinergia entre diferentes componentes de um protocolo descentralizado. O problema fundamental é que muitos projetos Web3 são isolados — você tem tokens que não fazem nada, NFTs sem utilidade, ou sistemas de governança sem participação real ativa.

Nossa solução é um ecossistema integrado onde cada componente alimenta e potencializa os outros:

- **Aquisição e Identidade Digital:** Os usuários podem adquirir **NFTs exclusivos** representando criaturas elementais em estilo pixel art. Cada NFT não é apenas um colecionável digital, mas sim um símbolo de participação ativa no protocolo, uma identidade visual dentro do ecossistema que confere status e pertencimento.

- **Moeda Nativa e Utilidade:** O **token ERC-20 (`ELEM`)** funciona como o sangue vital do ecossistema. Ele não é apenas um ativo especulativo, mas sim uma moeda de utilidade genuína com múltiplos casos de uso: serve para fazer staking e gerar recompensas passivas, é necessário para participar da governança através de votação, e pode ser usado para adquirir os NFTs, criando um ciclo econômico completo.

- **Staking Inteligente e Adaptativo:** O sistema de **staking** permite que usuários bloqueiem seus tokens `ELEM` para receber recompensas proporcionais. O que torna nosso sistema especial é que a taxa de recompensa não é fixa — ela se ajusta dinamicamente com base no preço do ETH/USD, obtido através de oráculos Chainlink confiáveis. Isso cria um mecanismo econômico mais resiliente e adaptável às condições de mercado.

- **Governança Real e Participativa:** A **DAO (Organização Autônoma Descentralizada)** não é apenas um enfeite técnico. Ela permite que qualquer detentor de tokens `ELEM` participe ativamente das decisões do protocolo. Os holders podem criar propostas, debater e votar em mudanças importantes, com peso proporcional à sua participação, garantindo que aqueles mais comprometidos com o ecossistema tenham maior influência nas decisões.

---

## 2. Contratos Inteligentes

O coração do **Elemental Protocol** é composto por cinco contratos inteligentes cuidadosamente projetados para trabalhar em harmonia, cada um com responsabilidades específicas mas interconectadas. Vamos explorar cada um deles em detalhe:

### 2.1 Token ERC-20 – `ElemToken.sol`

O **ElemToken** é a moeda nativa do nosso ecossistema, implementando o padrão ERC-20 amplamente adotado no Ethereum. Utilizamos a implementação robusta e testada da OpenZeppelin para garantir máxima segurança e compatibilidade.

- **Padrão:** ERC-20 (OpenZeppelin) - Garante compatibilidade com todas as carteiras e exchanges
- **Nome:** Elemental Token - Identificação clara e memorável
- **Símbolo:** ELEM - Símbolo curto e reconhecível
- **Supply inicial:** 1.000.000 ELEM - Quantidade fixa para criar escassez controlada
- **Funcionalidades essenciais:**
  - **Mint controlado:** A criação de novos tokens é restrita ao owner do contrato e ao contrato de staking, evitando inflação descontrolada
  - **Burn mechanism:** Usuários podem queimar tokens permanentemente, reduzindo o supply total e potencialmente aumentando o valor dos tokens restantes
  - **Pausável:** Em caso de emergência ou vulnerabilidade descoberta, o contrato pode ser pausado para proteger os fundos dos usuários

### 2.2 NFT ERC-721 – `ElemNFT.sol`

Os **Elemental Creatures** são nossa coleção exclusiva de NFTs, cada um representando uma criatura elemental única em estilo pixel art. Cada NFT é um ativo digital não fungível, verdadeiramente único e proprietário.

- **Padrão:** ERC-721 (OpenZeppelin) - Padrão estabelecido para NFTs no Ethereum
- **Nome:** Elemental Creatures - Nome temático que remete aos elementos da natureza
- **Símbolo:** ECRAFT - Identificação curta e marcante
- **Supply máximo:** 10 NFTs - Coleção limitada e exclusiva com arte pixel armazenada na pasta `NFT/`
- **Funcionalidades inovadoras:**
  - **Mint público flexível:** Usuários podem adquirir NFTs pagando com tokens ELEM ou ETH, oferecendo flexibilidade de pagamento
  - **Metadata URI:** Suporte para metadados on-chain ou IPFS, permitindo armazenamento descentralizado das informações e imagens dos NFTs
  - **Enumerável:** Implementação completa que permite consulta eficiente de todos os tokens existentes e seus proprietários

### 2.3 Staking – `ElemStaking.sol`

O contrato de **staking** é o motor econômico do protocolo, permitindo que usuários coloquem seus tokens ELEM para trabalhar e gerar recompensas passivas de forma segura e transparente.

- **Funcionalidades completas:**
  - **Stake de tokens ELEM:** Usuários podem depositar seus tokens no contrato para começar a acumular recompensas
  - **Withdraw flexível:** Retirada de tokens staked a qualquer momento, mantendo as recompensas acumuladas
  - **Claim de recompensas:** Sistema para resgatar as recompensas geradas pelo staking
  - **Taxa de recompensa dinâmica:** A taxa é ajustada automaticamente com base no preço ETH/USD via oráculo Chainlink, tornando o sistema mais adaptável
- **Segurança robusta:**
  - **ReentrancyGuard:** Proteção contra ataques de reentrancy, uma vulnerabilidade comum em contratos de staking
  - **Controle de acesso:** Implementação Ownable da OpenZeppelin para garantir que apenas endereços autorizados possam modificar parâmetros críticos

### 2.4 Governança (DAO) – `ElemDAO.sol`

A **DAO Elemental** é o sistema de governança descentralizada que permite que a comunidade participe ativamente das decisões do protocolo, garantindo evolução orgânica e descentralizada.

- **Funcionalidades democráticas:**
  - **Criação de propostas:** Qualquer holder de ELEM pode criar propostas com texto descritivo e ações específicas a serem executadas
  - **Votação ponderada:** Sistema de votação onde o peso de cada voto é proporcional ao saldo de tokens ELEM do votante
  - **Execução automatizada:** Propostas aprovadas com quórum mínimo são executadas automaticamente, garantindo implementação eficiente das decisões comunitárias
  - **Período configurável:** Tempo de votação ajustável para equilibrar rapidez e deliberação adequada
- **Segurança e integridade:**
  - **Snapshot de saldos:** Captura instantânea dos saldos no momento da criação da proposta para evitar manipulação de votos através de movimentação de tokens

### 2.5 Oráculo – `PriceFeed.sol`

O contrato **PriceFeed** serve como ponte entre nosso protocolo e o mundo real, fornecendo dados de preços externos de forma segura e confiável através da rede Chainlink.

- **Integração confiável:** Utiliza Chainlink Price Feed para obter o preço ETH/USD em tempo real
- **Uso estratégico:** O contrato de staking consulta este preço para ajustar dinamicamente a taxa de recompensa, criando um sistema mais resiliente às condições de mercado
- **Mecanismo de fallback:** Caso o oráculo falhe ou fique temporariamente indisponível, o sistema utiliza uma taxa fixa pré-configurada, garantindo continuidade das operações

---

## 3. Arquitetura do Projeto

A arquitetura do **Elemental Protocol** foi cuidadosamente estruturada para facilitar desenvolvimento, testes e manutenção, seguindo as melhores práticas do ecossistema Ethereum e ferramentas modernas como Hardhat Ignition. Cada diretório e componente tem um propósito específico, criando um fluxo de trabalho organizado e eficiente.

```text
Smartcontracts/
├── contracts/            # Contratos Solidity (estrutura compatível com Remix)
│   ├── ElemToken.sol     # Token ERC-20 nativo do ecossistema
│   ├── ElemNFT.sol       # Coleção NFT ERC-721 com arte pixel
│   ├── ElemStaking.sol   # Sistema de staking com recompensas dinâmicas
│   ├── ElemDAO.sol       # Sistema de governança descentralizada
│   ├── PriceFeed.sol     # Integração com oráculo Chainlink
│   └── mocks/            # Contratos mock para testes
│       └── MockAggregator.sol
├── ignition/             # Scripts de deploy com Hardhat Ignition
│   └── modules/
│       └── ElementalProtocol.ts  # Script principal de deploy
├── scripts/              # Scripts de utilidades e automação
│   ├── deploy.js         # Script legacy de deploy
│   ├── generate_nfts.py  # Utilitário para processar arte dos NFTs
│   ├── pack-project.sh   # Empacotamento do projeto
│   ├── run-slither.sh    # Wrapper para auditoria Slither
│   ├── run-mythril.sh    # Wrapper para auditoria Mythril
│   ├── setup-python-venv.sh  # Setup ambiente Python
│   ├── setup-mythril-venv.sh # Setup ambiente Mythril
│   ├── convert_drawio_to_png.py # Conversão de diagramas
│   └── send-op-tx.ts     # Envio de transações de teste
├── test/                 # Suíte completa de testes automatizados (TypeScript)
│   ├── ElemToken.ts      # Testes do token ERC-20
│   ├── ElemNFT.ts        # Testes do NFT ERC-721
│   ├── ElemStaking.ts    # Testes do sistema de staking
│   ├── ElemDAO.ts        # Testes da DAO
│   ├── PriceFeed.ts      # Testes do oráculo
│   └── Counter.ts        # Testes de exemplo
├── tests/                # Diretório adicional para testes
│   └── .gitkeep
├── ui/                   # Interface Web completa e responsiva
│   ├── index.html        # Página principal com todas as funcionalidades
│   ├── css/
│   │   └── style.css     # Estilos modernos e responsivos
│   ├── js/
│   │   └── app.js        # Lógica principal da aplicação Web3
│   └── imgs/             # Recursos visuais da interface
│       └── nft/          # Thumbnails dos NFTs para UI
├── NFT/                  # Arte original dos NFTs em formato GIF
│   ├── nft_01_fire_elemental.gif
│   ├── nft_02_water_spirit.gif
│   ├── nft_03_earth_golem.gif
│   ├── nft_04_lightning_bolt.gif
│   ├── nft_05_wind_sylph.gif
│   ├── nft_06_ice_crystal.gif
│   ├── nft_07_nature_sprite.gif
│   ├── nft_08_storm_giant.gif
│   ├── nft_09_lava_beast.gif
│   └── nft_10_magma_core.gif
├── docs/                 # Documentação técnica e acadêmica
│   ├── diagrams/         # Diagramas técnicos (drawio/png)
│   │   ├── 01_visao_geral_contratos.drawio
│   │   ├── 01_visao_geral_contratos.png
│   │   ├── 02_fluxo_interacoes.drawio
│   │   └── ...
│   ├── ETAPA_1.md        # Documentação de desenvolvimento
│   ├── TUTORIAL_AUDITORIA.md  # Guia de auditoria
│   ├── Nível Avançado - ... .pdf
│   └── Nível Avançado - ... .md
├── artifacts/            # Artefatos de compilação (gerados)
├── cache/                # Cache do Hardhat (gerados)
├── node_modules/         # Dependências npm (geradas)
├── .venv/                # Ambiente virtual Python (Slither)
├── .venv-mythril/        # Ambiente virtual Python (Mythril)
├── hardhat.config.ts     # Configuração do Hardhat
├── package.json          # Dependências e scripts npm
├── package-lock.json     # Lock de dependências
├── tsconfig.json         # Configuração TypeScript
├── requirements.txt      # Dependências Python (Slither)
├── requirements-dev.txt  # Dependências Python dev
├── requirements-mythril.txt # Dependências Python (Mythril)
├── .nvmrc                # Versão Node.js
├── .gitignore            # Arquivos ignorados pelo Git
├── LICENSE               # Licença do projeto
├── REQUISITOS.md         # Este documento de requisitos e arquitetura
└── README.md             # Guia completo de uso e deploy
```

Cada componente desta arquitetura foi projetado com independência e modularidade em mente, permitindo desenvolvimento paralelo, testes isolados e manutenção simplificada. A estrutura compatível com Remix IDE facilita o desenvolvimento rápido, enquanto a organização em diretórios distintos suporta workflows mais complexos de CI/CD e automação. O uso de Hardhat Ignition para deploy moderno e TypeScript para testes reflete as melhores práticas atuais do ecossistema Ethereum.

---

## 4. Interface Web (`ui/`)

A interface web do **Elemental Protocol** foi projetada para ser o ponto de encontro entre usuários e a blockchain, oferecendo uma experiência Web3 completa e intuitiva sem sacrificar funcionalidade. Utilizamos uma stack tecnológica enxuta mas poderosa, focando em performance e compatibilidade universal.

- **Stack Tecnológica:** HTML5 semântico + CSS3 moderno + JavaScript vanilla + **ethers.js** para interação blockchain direta

Esta abordagem minimalista garante:
- **Performance otimizada:** Sem frameworks pesados, carregamento rápido e responsividade imediata
- **Compatibilidade universal:** Funciona em qualquer navegador moderno sem dependências complexas
- **Segurança:** Menos superfície de ataque com código minimalista e auditável
- **Manutenibilidade:** Código limpo e documentado que facilita evolução futura

- **Funcionalidades Completas da Interface:**
  - **Conexão com MetaMask:** Integração segura e transparente com a carteira mais popular do ecossistema Ethereum
  - **Dashboard Personalizado:** Exibição clara e organizada do saldo de tokens ELEM e NFTs do usuário, com informações detalhadas sobre cada ativo
  - **Galeria NFT Interativa:** Visualização completa dos GIFs pixel art durante o processo de mint, com animações fluidas e informações de metadados
  - **Staking Simplificado:** Interface intuitiva para stake/unstake de tokens ELEM com cálculos em tempo real de recompensas esperadas
  - **Sistema de Recompensas:** Claim automático e manual de recompensas acumuladas, com histórico detalhado de transações
  - **Portal da DAO:** Criação, visualização e votação em propostas de governança com interface clara para debate comunitário
  - **Painel Oracular:** Exibição em tempo real do preço ETH/USD obtido através do oráculo Chainlink, com histórico e gráficos

A interface foi pensada para ser educativa, permitindo que usuários iniciantes entendam cada conceito Web3 através de uma experiência prática e guiada, enquanto usuários avançados têm acesso a todas as funcionalidades técnicas necessárias.

---

## 5. Segurança

A segurança é o pilar fundamental do **Elemental Protocol**. Em um ecossistema onde os fundos dos usuários e a integridade do protocolo estão em jogo, adotamos uma abordagem de segurança em múltiplas camadas, combinando melhores práticas de desenvolvimento, auditorias automatizadas e testes rigorosos.

Nossa estratégia de segurança abrange:

- [ ] **Proteção contra Reentrancy (ReentrancyGuard):** Implementação do padrão OpenZeppelin para prevenir ataques de reentrancy, uma das vulnerabilidades mais críticas em contratos inteligentes que manipulam fundos externos

- [ ] **Controle de Acesso Robusto (Ownable / AccessControl):** Sistema granular de permissões que garante que apenas endereços autorizados possam executar funções críticas como mint de tokens, alteração de parâmetros e pausa de emergência

- [ ] **Solidity ^0.8.x (Proteção Nativa):** Utilização da versão mais recente e estável do Solidity, que inclui proteção nativa contra overflow/underflow, eliminando uma classe inteira de vulnerabilidades aritméticas

- [ ] **Auditoria Estática com Slither:** Análise automatizada completa do código-fonte utilizando Slither, ferramenta especializada em detectar vulnerabilidades comuns, anti-padrões e problemas de otimização em contratos Solidity

- [ ] **Auditoria Simbólica com Mythril:** Análise complementar utilizando Mythril, que emprega técnicas de análise simbólica para descobrir caminhos de execução vulneráveis que podem escapar a outras ferramentas de análise

- [ ] **Suíte de Testes Abrangente com Hardhat:** Implementação completa de testes unitários, de integração e de edge cases cobrindo todos os fluxos críticos do protocolo, incluindo cenários de ataque e condições de erro

- [ ] **Relatório de Auditoria Detalhado:** Documentação completa de todas as vulnerabilidades encontradas, seu impacto, recomendações de mitigação e evidências de correção, garantindo transparência e responsabilidade

Cada medida de segurança é implementada proativamente durante o desenvolvimento, não como uma afterthought. Adotamos o princípio "security by design", onde cada linha de código é escrita com considerações de segurança em mente.

---

## 6. Deploy

O processo de deploy do **Elemental Protocol** é cuidadosamente planejado para garantir transição segura e transparente do ambiente de desenvolvimento para a rede de testes, mantendo a integridade de todos os componentes e facilitando verificação independente.

- **Rede de Destino:** Sepolia Testnet - Escolhida por sua estabilidade, ampla adoção e excelente suporte a ferramentas de desenvolvimento, permitindo experimentação realista sem custos financeiros

- **Ferramentas de Deploy:**
  - **Remix IDE:** Para desenvolvimento rápido e testes interativos, oferecendo ambiente familiar para desenvolvedores Solidity
  - **Hardhat:** Para automação de deploy, testes sistemáticos e integração com CI/CD, garantindo consistência e repetibilidade nos processos

- **Entregáveis Completos e Verificáveis:**
  - **Endereços de Contratos:** Lista completa e organizada de todos os contratos deployados com seus respectivos endereços na Sepolia
  - **Links do Etherscan:** URLs diretas para cada contrato no Etherscan Sepolia, permitindo verificação pública do código-fonte, análise de transações e auditoria independente
  - **README Explicativo:** Documentação detalhada do processo de deploy, incluindo configurações utilizadas, parâmetros de inicialização e guia passo a passo para replicação

O processo de deploy segue um ritual rigoroso: primeiro deploy dos contratos fundamentais (ElemToken e PriceFeed), depois dos contratos dependentes (ElemNFT, ElemStaking) e finalmente da DAO, garantindo que todas as dependências sejam resolvidas corretamente e que o sistema seja funcional desde o primeiro bloco.

---

## 7. Critérios de Avaliação

A avaliação do **Elemental Protocol** segue uma matriz abrangente que reconhece a complexidade multidimensional de um projeto Web3 completo. Cada critério foi ponderado para refletir sua importância relativa no sucesso geral do protocolo, garantindo uma avaliação equilibrada e justa.

| Critério                  | Peso | Descrição Detalhada |
|---------------------------|------|---------------------|
| **Arquitetura e Modelagem** | 20% | Qualidade do design, modularidade, escalabilidade e documentação técnica |
| **Implementação Técnica**   | 20% | Correção do código, eficiência, uso adequado de padrões e melhores práticas |
| **Segurança**               | 20% | Robustez contra ataques, auditorias completas e medidas de proteção implementadas |
| **Integração Oráculo**      | 10% | Funcionalidade e confiabilidade da integração com Chainlink Price Feed |
| **Integração Web3**         | 10% | Qualidade da interface web, experiência do usuário e funcionalidade completa |
| **Deploy em Testnet**       | 10% | Sucesso do deploy, verificação de contratos e documentação de entrega |
| **Clareza do Relatório**    | 10% | Qualidade da documentação, explicação técnica e apresentação dos resultados |

---

## 8. Roadmap de Desenvolvimento

O roadmap do **Elemental Protocol** foi estruturado em fases sequenciais e interdependentes, garantindo desenvolvimento ordenado e entrega de valor incremental. Cada fase constrói sobre a anterior, minimizando riscos e maximizando a qualidade final.

- [ ] **Fase 1: Fundação Conceitual** - Modelagem completa da arquitetura, definição de requisitos e elaboração deste documento de especificação técnica

- [ ] **Fase 2: Desenvolvimento Core** - Implementação sequencial dos contratos inteligentes na ordem de dependência: ElemToken → ElemNFT → ElemStaking → PriceFeed → ElemDAO

- [ ] **Fase 3: Validação Sistemática** - Desenvolvimento e execução de suíte completa de testes unitários e de integração, cobrindo todos os fluxos e edge cases

- [ ] **Fase 4: Fortificação de Segurança** - Auditorias automatizadas com Slither e Mythril, análise manual de vulnerabilidades e correção de issues encontrados

- [ ] **Fase 5: Experiência do Usuário** - Desenvolvimento da interface web completa, integração com MetaMask e criação da experiência Web3 final

- [ ] **Fase 6: Implantação Real** - Deploy em Sepolia, verificação de contratos, configuração final e testes em ambiente de produção

- [ ] **Fase 7: Documentação e Demonstração** - Elaboração da documentação final, criação de vídeo demonstrativo e preparação para apresentação

Cada fase inclui checkpoints de qualidade e critérios de aceite claros, garantindo que o projeto avance apenas quando os objetivos de cada etapa foram completamente atendidos.
