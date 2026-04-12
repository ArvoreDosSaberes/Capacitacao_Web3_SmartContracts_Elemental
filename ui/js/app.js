/**
 * Elemental Protocol – DApp Frontend
 * Utiliza exclusivamente ethers.js para interação com os contratos.
 */

// ============================================================
// Contract addresses – atualizar após deploy em Sepolia
// ============================================================
const ADDRESSES = {
    ElemToken:   "0xd8347173AF4D69Ae63ECfE4FF73C12fE349ed44e",
    ElemNFT:     "0x25e814A250a3C6a576e1F8e766328CC3C5B4fF89",
    ElemStaking: "0xd20379FA2B0c4F787983A72895707789e395AC06",
    ElemDAO:     "0x585e25acf2200aDA4736CdCd9F3128fA072f615D",
    PriceFeed:   "0x3e59BfD48799217eA7c1b5cCE25b920C6E791fcC",
};

// ============================================================
// ABIs mínimos – substituir pelos ABIs completos após compilação
// ============================================================
const ABI = {
    ElemToken: [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
    ],
    ElemNFT: [
        "function MAX_SUPPLY() view returns (uint256)",
        "function mintPrice() view returns (uint256)",
        "function mint(string uri) payable",
        "function balanceOf(address) view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function creatureName(uint256 tokenId) view returns (string)",
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function totalSupply() view returns (uint256)",
        "function getHighResDownloadURL(uint256 tokenId) view returns (string)",
        "function getIPFSMetadata(uint256 tokenId) view returns (string imageHash, string highResHash, string metadataHash, uint256 timestamp)",
        "function hasIPFSMetadata(uint256 tokenId) view returns (bool)",
        "event NFTMinted(address indexed to, uint256 indexed tokenId, string name)",
        "event IPFSMetadataUpdated(uint256 indexed tokenId, string imageHash, string highResHash, string metadataHash)",
    ],
    ElemStaking: [
        "function totalStaked() view returns (uint256)",
        "function stakes(address) view returns (uint256 amount, uint256 rewardDebt, uint256 lastUpdate)",
        "function pendingReward(address) view returns (uint256)",
        "function baseRate() view returns (uint256)",
        "function stake(uint256 amount)",
        "function withdraw(uint256 amount)",
        "function claimReward()",
        "event Staked(address indexed user, uint256 amount)",
        "event Withdrawn(address indexed user, uint256 amount)",
        "event RewardClaimed(address indexed user, uint256 reward)",
    ],
    ElemDAO: [
        "function proposalCount() view returns (uint256)",
        "function proposals(uint256) view returns (uint256 id, address proposer, string description, uint256 forVotes, uint256 againstVotes, uint256 startTime, uint256 endTime, bool executed)",
        "function state(uint256 proposalId) view returns (uint8)",
        "function hasVoted(uint256, address) view returns (bool)",
        "function createProposal(string description) returns (uint256)",
        "function vote(uint256 proposalId, bool support)",
        "function executeProposal(uint256 proposalId)",
        "event ProposalCreated(uint256 indexed id, address indexed proposer, string description)",
        "event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
        "event ProposalExecuted(uint256 indexed id)",
    ],
    PriceFeed: [
        "function getLatestPrice() view returns (int256)",
        "function FALLBACK_PRICE() view returns (int256)",
    ],
};

// ============================================================
// NFT Metadata
// ============================================================
const IPFS_GATEWAY = "https://fuchsia-bright-ferret-822.mypinata.cloud/ipfs/";

const NFT_META = [
    { id: 0,  name: "Fire Elemental",   cid: "bafkreiegrsudhiu7nj3ya6kquogwsm4y5ob7qsernczfplpkyytaorw7s4", img: "/NFT/nft_01_fire_elemental.gif",   thumb: "imgs/nft/nft_01_fire_elemental_thumb.png"   },
    { id: 1,  name: "Water Spirit",      cid: "bafkreibavuqexo3iga5k6ndp2hwmu655fa7sfebocwedcfce2nkqe3o4ly", img: "/NFT/nft_02_water_spirit.gif",     thumb: "imgs/nft/nft_02_water_spirit_thumb.png"     },
    { id: 2,  name: "Earth Golem",       cid: "bafkreib2ucmwfrcafrxho37xxjam65rmesoazeh2tojowxt5p7zjomvfme", img: "/NFT/nft_03_earth_golem.gif",      thumb: "imgs/nft/nft_03_earth_golem_thumb.png"      },
    { id: 3,  name: "Lightning Bolt",    cid: "bafkreibm5ghiagapyz7jnjumb4ssohcs6nmh22dqrohjdapd4ndfxf2mzu", img: "/NFT/nft_04_lightning_bolt.gif",    thumb: "imgs/nft/nft_04_lightning_bolt_thumb.png"    },
    { id: 4,  name: "Shadow Phantom",    cid: "bafkreiguquans32puczpkp5sbh35vnb5gmoih62475ehl2iycoradtt5ha", img: "/NFT/nft_05_shadow_phantom.gif",   thumb: "imgs/nft/nft_05_shadow_phantom_thumb.png"   },
    { id: 5,  name: "Crystal Gem",       cid: "bafkreic72k2rudh3an4amgh52hwidikocsuiorvkj4aqzs7ywfutpa5g5e", img: "/NFT/nft_06_crystal_gem.gif",      thumb: "imgs/nft/nft_06_crystal_gem_thumb.png"      },
    { id: 6,  name: "Solar Flare",       cid: "bafkreihpcvsui6lsqjnjwasrqcaupeczhi5ru4onh4x4ty4xsz77xe4rta", img: "/NFT/nft_07_solar_flare.gif",      thumb: "imgs/nft/nft_07_solar_flare_thumb.png"      },
    { id: 7,  name: "Toxic Slime",       cid: "bafkreidbvemvnrkxos24g77pls4yt7leq2v7mvipcofg3mu2nvinzjhjo4", img: "/NFT/nft_08_toxic_slime.gif",      thumb: "imgs/nft/nft_08_toxic_slime_thumb.png"      },
    { id: 8,  name: "Frost Shard",       cid: "bafkreigymcuvytgm7ggpnrnhjb7ijcricpbqtqe4nhln4k7vxrzezwkoay", img: "/NFT/nft_09_frost_shard.gif",      thumb: "imgs/nft/nft_09_frost_shard_thumb.png"      },
    { id: 9,  name: "Magma Core",        cid: "bafkreidlgpxwvtbdzwjoywopuvdyps54jv5q4gdx6nt2wi334spkihx7ve", img: "/NFT/nft_10_magma_core.gif",       thumb: "imgs/nft/nft_10_magma_core_thumb.png"       },
];

// ============================================================
// State
// ============================================================
let provider = null;
let signer = null;
let userAddress = null;
let contracts = {};

// ============================================================
// DOM references
// ============================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================================
// Toast notifications
// ============================================================
function toast(message, type = "info") {
    const container = $("#toast-container");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

// ============================================================
// Wallet connection
// ============================================================
async function connectWallet() {
    if (!window.ethereum) {
        toast("MetaMask não encontrado! Instale a extensão.", "error");
        return;
    }
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        $("#btn-connect").textContent = shortAddr(userAddress);
        $("#btn-connect").classList.add("connected");
        $("#wallet-info").style.display = "flex";

        initContracts();
        await refreshAll();
        toast("Carteira conectada!", "success");
    } catch (err) {
        console.error(err);
        toast("Erro ao conectar carteira.", "error");
    }
}

function shortAddr(addr) {
    return addr.slice(0, 6) + "…" + addr.slice(-4);
}

// ============================================================
// Contract instances
// ============================================================
function initContracts() {
    contracts.token    = new ethers.Contract(ADDRESSES.ElemToken,   ABI.ElemToken,   signer);
    contracts.nft      = new ethers.Contract(ADDRESSES.ElemNFT,     ABI.ElemNFT,     signer);
    contracts.staking  = new ethers.Contract(ADDRESSES.ElemStaking, ABI.ElemStaking, signer);
    contracts.dao      = new ethers.Contract(ADDRESSES.ElemDAO,     ABI.ElemDAO,     signer);
    contracts.price    = new ethers.Contract(ADDRESSES.PriceFeed,   ABI.PriceFeed,   signer);
}

// ============================================================
// Data refresh
// ============================================================
async function refreshAll() {
    if (!userAddress) return;
    await Promise.allSettled([
        refreshBalances(),
        refreshStaking(),
        refreshNFTs(),
        refreshOracle(),
        refreshProposals(),
    ]);
}

async function refreshBalances() {
    try {
        const [elemBal, ethBal] = await Promise.all([
            contracts.token.balanceOf(userAddress),
            provider.getBalance(userAddress),
        ]);
        const elemFmt = parseFloat(ethers.utils.formatEther(elemBal)).toFixed(2);
        const ethFmt  = parseFloat(ethers.utils.formatEther(ethBal)).toFixed(4);

        $("#elem-balance").textContent = `${elemFmt} ELEM`;
        $("#eth-balance").textContent  = `${ethFmt} ETH`;
        $("#wallet-address").textContent = shortAddr(userAddress);
        $("#dash-elem").textContent = elemFmt;
    } catch (e) {
        console.warn("refreshBalances:", e.message);
    }
}

async function refreshStaking() {
    try {
        const [totalStaked, stakeInfo, pending, baseRate] = await Promise.all([
            contracts.staking.totalStaked(),
            contracts.staking.stakes(userAddress),
            contracts.staking.pendingReward(userAddress),
            contracts.staking.baseRate(),
        ]);
        const totalFmt   = parseFloat(ethers.utils.formatEther(totalStaked)).toFixed(2);
        const mineFmt    = parseFloat(ethers.utils.formatEther(stakeInfo.amount)).toFixed(2);
        const rewardFmt  = parseFloat(ethers.utils.formatEther(pending)).toFixed(4);
        const ratePct    = (baseRate.toNumber() / 100).toFixed(2) + "%/dia";

        $("#stk-total").textContent   = totalFmt;
        $("#stk-mine").textContent    = mineFmt;
        $("#stk-rewards").textContent = rewardFmt;
        $("#stk-rate").textContent    = ratePct;
        $("#dash-staked").textContent  = mineFmt;
        $("#dash-rewards").textContent = rewardFmt;
    } catch (e) {
        console.warn("refreshStaking:", e.message);
    }
}

async function refreshNFTs() {
    try {
        const grid = $("#nft-grid");
        grid.innerHTML = "";

        let totalMinted = 0;
        try {
            totalMinted = (await contracts.nft.totalSupply()).toNumber();
        } catch (_) {}

        const mintPrice = await contracts.nft.mintPrice();
        const priceFmt = ethers.utils.formatEther(mintPrice);

        for (const nft of NFT_META) {
            const card = document.createElement("div");
            card.className = "nft-card";

            let ownerLabel = "Disponível";
            let isMinted = nft.id < totalMinted;
            let isOwner = false;
            let downloadURL = "";

            if (isMinted) {
                try {
                    const owner = await contracts.nft.ownerOf(nft.id);
                    ownerLabel = owner.toLowerCase() === userAddress.toLowerCase()
                        ? "Seu NFT"
                        : `Owner: ${shortAddr(owner)}`;
                    isOwner = owner.toLowerCase() === userAddress.toLowerCase();
                    
                    // URL de download: contrato (alta res) → fallback IPFS CID (GIF)
                    if (isOwner) {
                        try {
                            downloadURL = await contracts.nft.getHighResDownloadURL(nft.id);
                        } catch (_) {}
                        if (!downloadURL && nft.cid) {
                            downloadURL = IPFS_GATEWAY + nft.cid;
                        }
                    }
                } catch (_) {
                    ownerLabel = "Mintado";
                }
            }

            card.innerHTML = `
                <img src="${nft.thumb}" alt="${nft.name}" loading="lazy">
                <div class="nft-info">
                    <h4>#${nft.id} - ${nft.name}</h4>
                    <p>${ownerLabel}</p>
                    ${!isMinted
                        ? `<button class="btn btn-primary btn-mint" data-id="${nft.id}" data-price="${mintPrice}">
                            Mint (${priceFmt} ETH)
                           </button>`
                        : isOwner
                            ? `<div class="owner-actions">
                                <span style="color:var(--success);font-size:0.8rem;">Na sua carteira</span>
                                ${downloadURL
                                    ? `<button class="btn btn-success btn-download" data-url="${downloadURL}" data-name="${nft.name}">
                                        ⬇ Download IPFS
                                       </button>`
                                    : '<span style="color:var(--text-secondary);font-size:0.7rem;">Download indisponível</span>'
                                }
                               </div>`
                            : ''
                    }
                </div>`;
            grid.appendChild(card);
        }

        // Count user NFTs
        try {
            const userNFTCount = (await contracts.nft.balanceOf(userAddress)).toNumber();
            $("#dash-nfts").textContent = userNFTCount;
        } catch (_) {
            $("#dash-nfts").textContent = "0";
        }

        // Mint buttons
        grid.querySelectorAll(".btn-mint").forEach((btn) => {
            btn.addEventListener("click", () => mintNFT(btn.dataset.id, btn.dataset.price));
        });

        // Download buttons
        grid.querySelectorAll(".btn-download").forEach((btn) => {
            btn.addEventListener("click", () => downloadHighRes(btn.dataset.url, btn.dataset.name));
        });
    } catch (e) {
        console.warn("refreshNFTs:", e.message);
    }
}

async function refreshOracle() {
    try {
        const price = await contracts.price.getLatestPrice();
        const usd = (price.toNumber() / 1e8).toFixed(2);
        $("#oracle-price").textContent = `$ ${usd} USD`;
        $("#dash-price").textContent   = `$${usd}`;
    } catch (e) {
        console.warn("refreshOracle:", e.message);
    }
}

async function refreshProposals() {
    try {
        const count = (await contracts.dao.proposalCount()).toNumber();
        const list = $("#proposals-list");

        if (count === 0) {
            list.innerHTML = '<p style="color:var(--text-secondary);">Nenhuma proposta encontrada.</p>';
            return;
        }

        list.innerHTML = "";
        const stateLabels = ["Active", "Approved", "Rejected", "Executed"];
        const stateCSS    = ["status-active", "status-approved", "status-rejected", "status-executed"];

        for (let i = count - 1; i >= 0 && i >= count - 20; i--) {
            const p = await contracts.dao.proposals(i);
            const s = (await contracts.dao.state(i));
            const voted = await contracts.dao.hasVoted(i, userAddress);
            const totalVotes = p.forVotes.add(p.againstVotes);
            const forPct = totalVotes.gt(0)
                ? p.forVotes.mul(100).div(totalVotes).toNumber()
                : 0;

            const item = document.createElement("div");
            item.className = "proposal-item";
            item.innerHTML = `
                <div class="proposal-header">
                    <span class="proposal-id">Proposta #${p.id}</span>
                    <span class="proposal-status ${stateCSS[s]}">${stateLabels[s]}</span>
                </div>
                <p style="font-size:0.9rem;">${p.description}</p>
                <div class="vote-bar"><div class="fill" style="width:${forPct}%"></div></div>
                <p style="font-size:0.75rem;color:var(--text-secondary);">
                    A favor: ${ethers.utils.formatEther(p.forVotes)} ELEM |
                    Contra: ${ethers.utils.formatEther(p.againstVotes)} ELEM
                </p>
                ${s === 0 && !voted ? `
                <div class="vote-actions">
                    <button class="btn btn-success btn-vote-for" data-id="${i}">Votar A Favor</button>
                    <button class="btn btn-danger btn-vote-against" data-id="${i}">Votar Contra</button>
                </div>` : ''}
                ${s === 1 ? `
                <button class="btn btn-primary btn-execute" data-id="${i}" style="margin-top:0.5rem;">Executar</button>
                ` : ''}
            `;
            list.appendChild(item);
        }

        // Bind vote/execute buttons
        list.querySelectorAll(".btn-vote-for").forEach((btn) => {
            btn.addEventListener("click", () => voteProposal(btn.dataset.id, true));
        });
        list.querySelectorAll(".btn-vote-against").forEach((btn) => {
            btn.addEventListener("click", () => voteProposal(btn.dataset.id, false));
        });
        list.querySelectorAll(".btn-execute").forEach((btn) => {
            btn.addEventListener("click", () => executeProposal(btn.dataset.id));
        });
    } catch (e) {
        console.warn("refreshProposals:", e.message);
    }
}

// ============================================================
// Actions
// ============================================================

async function mintNFT(tokenId, price) {
    try {
        toast("Enviando transação de mint…", "info");
        const nft = NFT_META[tokenId];
        const uri = nft.cid ? (IPFS_GATEWAY + nft.cid) : nft.img;
        const tx = await contracts.nft.mint(uri, { value: price });
        toast("Aguardando confirmação…", "info");
        await tx.wait();
        toast(`NFT #${tokenId} mintado com sucesso!`, "success");
        await refreshNFTs();
        await refreshBalances();
    } catch (err) {
        console.error(err);
        toast("Erro no mint: " + (err.reason || err.message), "error");
    }
}

async function stakeTokens() {
    // Check if wallet is connected and contracts are initialized
    if (!signer || !userAddress || !contracts.token) {
        toast("Conecte sua carteira primeiro.", "error");
        return;
    }
    
    const amount = $("#stake-amount").value;
    if (!amount || parseFloat(amount) <= 0) {
        toast("Informe uma quantidade válida.", "error");
        return;
    }
    try {
        const wei = ethers.utils.parseEther(amount);
        // Approve first
        toast("Aprovando tokens…", "info");
        const allowance = await contracts.token.allowance(userAddress, ADDRESSES.ElemStaking);
        if (allowance.lt(wei)) {
            const approveTx = await contracts.token.approve(ADDRESSES.ElemStaking, wei);
            await approveTx.wait();
        }
        toast("Enviando stake…", "info");
        const tx = await contracts.staking.stake(wei);
        await tx.wait();
        toast(`${amount} ELEM em staking!`, "success");
        $("#stake-amount").value = "";
        await refreshAll();
    } catch (err) {
        console.error(err);
        toast("Erro no stake: " + (err.reason || err.message), "error");
    }
}

async function unstakeTokens() {
    // Check if wallet is connected and contracts are initialized
    if (!signer || !userAddress || !contracts.staking) {
        toast("Conecte sua carteira primeiro.", "error");
        return;
    }
    
    const amount = $("#stake-amount").value;
    if (!amount || parseFloat(amount) <= 0) {
        toast("Informe uma quantidade válida.", "error");
        return;
    }
    try {
        const wei = ethers.utils.parseEther(amount);
        toast("Enviando unstake…", "info");
        const tx = await contracts.staking.withdraw(wei);
        await tx.wait();
        toast(`${amount} ELEM retirados do staking!`, "success");
        $("#stake-amount").value = "";
        await refreshAll();
    } catch (err) {
        console.error(err);
        toast("Erro no unstake: " + (err.reason || err.message), "error");
    }
}

async function claimRewards() {
    // Check if wallet is connected and contracts are initialized
    if (!signer || !userAddress || !contracts.staking) {
        toast("Conecte sua carteira primeiro.", "error");
        return;
    }
    
    try {
        // First check if there are pending rewards
        const pending = await contracts.staking.pendingReward(userAddress);
        const pendingFormatted = parseFloat(ethers.utils.formatEther(pending)).toFixed(6);
        
        if (pending.eq(0)) {
            toast("Você não tem recompensas pendentes. Faça staking para começar a acumular recompensas.", "warning");
            return;
        }
        
        toast(`Coletando ${pendingFormatted} ELEM em recompensas...`, "info");
        const tx = await contracts.staking.claimReward();
        await tx.wait();
        toast(`${pendingFormatted} ELEM coletados com sucesso!`, "success");
        await refreshAll();
    } catch (err) {
        console.error(err);
        if (err.reason && err.reason.includes("no rewards")) {
            toast("Você não tem recompensas disponíveis para coletar.", "warning");
        } else {
            toast("Erro ao coletar: " + (err.reason || err.message), "error");
        }
    }
}

async function createProposal() {
    const desc = $("#proposal-desc").value.trim();
    if (!desc) {
        toast("Preencha a descrição da proposta.", "error");
        return;
    }
    try {
        toast("Criando proposta…", "info");
        const tx = await contracts.dao.createProposal(desc);
        await tx.wait();
        toast("Proposta criada!", "success");
        $("#proposal-desc").value = "";
        await refreshProposals();
    } catch (err) {
        console.error(err);
        toast("Erro ao criar proposta: " + (err.reason || err.message), "error");
    }
}

async function voteProposal(id, support) {
    try {
        toast(`Votando ${support ? "a favor" : "contra"}…`, "info");
        const tx = await contracts.dao.vote(id, support);
        await tx.wait();
        toast("Voto registrado!", "success");
        await refreshProposals();
    } catch (err) {
        console.error(err);
        toast("Erro ao votar: " + (err.reason || err.message), "error");
    }
}

async function executeProposal(id) {
    try {
        toast("Executando proposta…", "info");
        const tx = await contracts.dao.executeProposal(id);
        await tx.wait();
        toast("Proposta executada!", "success");
        await refreshProposals();
    } catch (err) {
        console.error(err);
        toast("Erro ao executar: " + (err.reason || err.message), "error");
    }
}

async function downloadHighRes(url, name) {
    try {
        toast("Iniciando download...", "info");
        
        // Criar link temporário para download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '_')}_high_res.png`;
        link.target = '_blank';
        
        // Adicionar ao DOM e clicar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast("Download iniciado!", "success");
    } catch (err) {
        console.error(err);
        toast("Erro no download: " + err.message, "error");
    }
}

// ============================================================
// Tab navigation
// ============================================================
function setupTabs() {
    $$(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            $$(".tab-btn").forEach((b) => b.classList.remove("active"));
            $$(".panel").forEach((p) => p.classList.remove("active"));
            btn.classList.add("active");
            $(`#${btn.dataset.tab}`).classList.add("active");
        });
    });
}

// ============================================================
// Static NFT gallery (thumbnails, no wallet required)
// ============================================================
function renderNFTGallery() {
    const grid = $("#nft-grid");
    grid.innerHTML = "";
    for (const nft of NFT_META) {
        const card = document.createElement("div");
        card.className = "nft-card nft-card-thumb";
        card.innerHTML = `
            <img src="${nft.thumb}" alt="${nft.name}" width="64" height="64" loading="lazy">
            <div class="nft-info">
                <h4>#${nft.id} – ${nft.name}</h4>
                <p>Disponível</p>
            </div>`;
        grid.appendChild(card);
    }
}

// ============================================================
// Events & Init
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    renderNFTGallery();

    $("#btn-connect").addEventListener("click", connectWallet);
    $("#btn-stake").addEventListener("click", stakeTokens);
    $("#btn-unstake").addEventListener("click", unstakeTokens);
    $("#btn-claim").addEventListener("click", claimRewards);
    $("#btn-create-proposal").addEventListener("click", createProposal);
    $("#btn-refresh-price").addEventListener("click", async () => {
        await refreshOracle();
        toast("Preço atualizado!", "info");
    });

    // Auto-connect if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectWallet();
    }

    // Listen for account/network changes
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", () => window.location.reload());
        window.ethereum.on("chainChanged", () => window.location.reload());
    }
});
