// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ElemNFT
 * @dev Coleção NFT ERC-721 — 10 criaturas pixel art do ecossistema Elemental.
 */
contract ElemNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public mintPrice = 0.01 ether;
    uint256 private _nextTokenId;

    // Estrutura para metadados IPFS
    struct IPFSMetadata {
        string imageHash;        // Hash da imagem principal (GIF)
        string highResHash;     // Hash da versão de alta resolução (PNG)
        string metadataHash;    // Hash do JSON de metadados completo
        uint256 timestamp;      // Timestamp do upload
    }

    // Mapeamento de tokenId para metadados IPFS
    mapping(uint256 => IPFSMetadata) public ipfsMetadata;

    string[10] private _tokenNames = [
        "Fire Elemental",
        "Water Spirit",
        "Earth Golem",
        "Lightning Bolt",
        "Shadow Phantom",
        "Crystal Gem",
        "Solar Flare",
        "Toxic Slime",
        "Frost Shard",
        "Magma Core"
    ];

    event NFTMinted(address indexed to, uint256 indexed tokenId, string name);
    event IPFSMetadataUpdated(uint256 indexed tokenId, string imageHash, string highResHash, string metadataHash);

    constructor(address initialOwner)
        ERC721("Elemental Creatures", "ECRAFT")
        Ownable(initialOwner)
    {}

    /// @notice Mint de um NFT pagando em ETH
    function mint(string calldata uri) external payable {
        require(_nextTokenId < MAX_SUPPLY, "ElemNFT: all NFTs minted");
        require(msg.value >= mintPrice, "ElemNFT: insufficient ETH");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(msg.sender, tokenId, _tokenNames[tokenId]);
    }

    /// @notice Retorna o nome da criatura pelo tokenId
    function creatureName(uint256 tokenId) external view returns (string memory) {
        require(tokenId < MAX_SUPPLY, "ElemNFT: invalid tokenId");
        return _tokenNames[tokenId];
    }

    /// @notice Atualiza metadados IPFS do NFT (owner apenas)
    function updateIPFSMetadata(
        uint256 tokenId,
        string calldata imageHash,
        string calldata highResHash,
        string calldata metadataHash
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "ElemNFT: token does not exist");
        
        ipfsMetadata[tokenId] = IPFSMetadata({
            imageHash: imageHash,
            highResHash: highResHash,
            metadataHash: metadataHash,
            timestamp: block.timestamp
        });
        
        emit IPFSMetadataUpdated(tokenId, imageHash, highResHash, metadataHash);
    }

    /// @notice Retorna URL de download de alta resolução
    function getHighResDownloadURL(uint256 tokenId) external view returns (string memory) {
        require(tokenId < MAX_SUPPLY, "ElemNFT: invalid tokenId");
        
        IPFSMetadata memory metadata = ipfsMetadata[tokenId];
        if (bytes(metadata.highResHash).length > 0) {
            return string(abi.encodePacked(
                "https://fuchsia-bright-ferret-822.mypinata.cloud/ipfs/",
                metadata.highResHash
            ));
        }
        
        return "";
    }

    /// @notice Retorna metadados IPFS completos
    function getIPFSMetadata(uint256 tokenId) external view returns (
        string memory imageHash,
        string memory highResHash,
        string memory metadataHash,
        uint256 timestamp
    ) {
        require(tokenId < MAX_SUPPLY, "ElemNFT: invalid tokenId");
        
        IPFSMetadata memory metadata = ipfsMetadata[tokenId];
        return (
            metadata.imageHash,
            metadata.highResHash,
            metadata.metadataHash,
            metadata.timestamp
        );
    }

    /// @notice Verifica se NFT tem metadados IPFS
    function hasIPFSMetadata(uint256 tokenId) external view returns (bool) {
        require(tokenId < MAX_SUPPLY, "ElemNFT: invalid tokenId");
        
        IPFSMetadata memory metadata = ipfsMetadata[tokenId];
        return bytes(metadata.imageHash).length > 0;
    }

    /// @notice Altera preço de mint (owner)
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    /// @notice Saque de ETH acumulado
    function withdraw() external onlyOwner {
        // Checks: Verificar se há saldo para sacar
        uint256 amount = address(this).balance;
        require(amount > 0, "ElemNFT: no ETH to withdraw");
        
        // Effects: Atualizar estado antes da transferência externa
        address payable recipient = payable(owner());
        
        // Interactions: Transferência segura com gas limitado
        (bool success, ) = recipient.call{value: amount, gas: 50000}("");
        require(success, "ElemNFT: withdraw failed");
    }

    // --- Overrides necessários ---

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
