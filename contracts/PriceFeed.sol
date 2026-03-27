// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PriceFeed
 * @dev Wrapper para Chainlink Price Feed (ETH/USD).
 *      Usado pelo contrato de staking para ajustar recompensas.
 */
contract PriceFeed is Ownable {
    AggregatorV3Interface internal priceFeed;

    /// @dev Preço fallback caso o oráculo falhe (ex.: 2000 USD com 8 decimais)
    int256 public constant FALLBACK_PRICE = 2000 * 1e8;

    /// @dev Endereço Chainlink ETH/USD em Sepolia
    /// Sepolia: 0x694AA1769357215DE4FAC081bf1f309aDC325306
    constructor(address feedAddress, address initialOwner) Ownable(initialOwner) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }

    /**
     * @notice Retorna o preço mais recente do ETH em USD (8 decimais).
     * @return price Preço ETH/USD. Retorna fallback se a chamada falhar.
     */
    function getLatestPrice() public view returns (int256 price) {
        try priceFeed.latestRoundData() returns (
            uint80,
            int256 answer,
            uint256,
            uint256,
            uint80
        ) {
            if (answer > 0) {
                return answer;
            }
        } catch {}
        return FALLBACK_PRICE;
    }

    /// @notice Atualiza o endereço do feed (owner)
    function setFeed(address newFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(newFeed);
    }
}
