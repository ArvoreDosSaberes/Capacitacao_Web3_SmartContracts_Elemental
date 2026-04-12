![visitors](https://visitor-badge.laobi.icu/badge?page_id=ArvoreDosSaberes.Capacitacao_Web3_SmartContracts_Elemental.NFT)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Prática-green)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)
![Repository Size](https://img.shields.io/github/repo-size/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)
![Last Commit](https://img.shields.io/github/last-commit/ArvoreDosSaberes/Capacitacao_Web3_SmartContracts_Elemental)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:d97706,50:ea580c,100:92400e&height=220&section=header&text=Elemental%20NFT%20Assets&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Mapeamento%20IPFS%20dos%20GIFs%20da%20Cole%C3%A7%C3%A3o&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Elemental NFT Assets Header"/>
</p>

## Mapeamento IPFS — Elemental Creatures Collection

Todos os GIFs animados dos NFTs estão pinados no IPFS via Pinata.
Use os CIDs abaixo para referência em deploys, contratos e frontend.

### Tabela de CIDs

| Token ID | Nome             | Arquivo                        | CID (IPFS)                                                          |
|----------|------------------|--------------------------------|----------------------------------------------------------------------|
| 0        | Fire Elemental   | `nft_01_fire_elemental.gif`    | `bafkreiegrsudhiu7nj3ya6kquogwsm4y5ob7qsernczfplpkyytaorw7s4`       |
| 1        | Water Spirit     | `nft_02_water_spirit.gif`      | `bafkreibavuqexo3iga5k6ndp2hwmu655fa7sfebocwedcfce2nkqe3o4ly`       |
| 2        | Earth Golem      | `nft_03_earth_golem.gif`       | `bafkreib2ucmwfrcafrxho37xxjam65rmesoazeh2tojowxt5p7zjomvfme`       |
| 3        | Lightning Bolt   | `nft_04_lightning_bolt.gif`    | `bafkreibm5ghiagapyz7jnjumb4ssohcs6nmh22dqrohjdapd4ndfxf2mzu`       |
| 4        | Shadow Phantom   | `nft_05_shadow_phantom.gif`    | `bafkreiguquans32puczpkp5sbh35vnb5gmoih62475ehl2iycoradtt5ha`       |
| 5        | Crystal Gem      | `nft_06_crystal_gem.gif`       | `bafkreic72k2rudh3an4amgh52hwidikocsuiorvkj4aqzs7ywfutpa5g5e`       |
| 6        | Solar Flare      | `nft_07_solar_flare.gif`       | `bafkreihpcvsui6lsqjnjwasrqcaupeczhi5ru4onh4x4ty4xsz77xe4rta`      |
| 7        | Toxic Slime      | `nft_08_toxic_slime.gif`       | `bafkreidbvemvnrkxos24g77pls4yt7leq2v7mvipcofg3mu2nvinzjhjo4`       |
| 8        | Frost Shard      | `nft_09_frost_shard.gif`       | `bafkreigymcuvytgm7ggpnrnhjb7ijcricpbqtqe4nhln4k7vxrzezwkoay`       |
| 9        | Magma Core       | `nft_10_magma_core.gif`        | `bafkreidlgpxwvtbdzwjoywopuvdyps54jv5q4gdx6nt2wi334spkihx7ve`       |

### Gateway dedicado (Pinata)

```text
https://fuchsia-bright-ferret-822.mypinata.cloud/ipfs/<CID>
```

### Gateways alternativos

- `https://ipfs.io/ipfs/<CID>`
- `https://gateway.pinata.cloud/ipfs/<CID>`
- `https://cloudflare-ipfs.com/ipfs/<CID>`

### Exemplo de acesso

```text
https://fuchsia-bright-ferret-822.mypinata.cloud/ipfs/bafkreiegrsudhiu7nj3ya6kquogwsm4y5ob7qsernczfplpkyytaorw7s4
```

### Como usar no contrato

Após o deploy, o owner do contrato pode registrar os CIDs via `updateIPFSMetadata`:

```solidity
// Exemplo: registrar NFT #0 (Fire Elemental)
nft.updateIPFSMetadata(
    0,
    "bafkreiegrsudhiu7nj3ya6kquogwsm4y5ob7qsernczfplpkyytaorw7s4", // imageHash (GIF)
    "",   // highResHash (PNG de alta resolução, quando disponível)
    ""    // metadataHash (JSON de metadados, quando disponível)
);
```

### Como usar no frontend

O array `NFT_META` em `ui/js/app.js` já contém os campos `ipfs` com os CIDs correspondentes.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:92400e,50:ea580c,100:d97706&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Mapeamento dos CIDs IPFS (Pinata) para os 10 GIFs animados da coleção Elemental Creatures NFT.
**Data de Criação:** 2025-04-12
**Autor:** Carlos Delfino
**Versão:** 1.0
**Última Atualização:** 2025-04-12
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2025-04-12 - Criado por Carlos Delfino - Upload manual dos 10 GIFs para Pinata IPFS - Versão 1.0
