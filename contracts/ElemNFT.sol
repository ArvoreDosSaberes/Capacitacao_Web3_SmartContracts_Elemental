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

    /// @notice Altera preço de mint (owner)
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    /// @notice Saque de ETH acumulado
    function withdraw() external onlyOwner {
        (bool ok, ) = payable(owner()).call{value: address(this).balance}("");
        require(ok, "ElemNFT: withdraw failed");
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
