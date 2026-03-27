// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IPriceFeed {
    function getLatestPrice() external view returns (int256);
}

/**
 * @title ElemStaking
 * @dev Staking de tokens ELEM com recompensas ajustadas pelo oráculo ETH/USD.
 *      Quando o preço do ETH sobe, a taxa de recompensa diminui (deflacionário).
 *      Quando o preço do ETH cai, a taxa de recompensa aumenta (incentivo).
 */
contract ElemStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable elemToken;
    IPriceFeed public priceFeed;

    /// @dev Taxa base de recompensa: 100 = 1% ao dia (base 10000)
    uint256 public baseRate = 100;

    /// @dev Preço de referência ETH/USD (8 decimais) para cálculo de ajuste
    int256 public constant REFERENCE_PRICE = 2000 * 1e8;

    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdate;
    }

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(
        address _elemToken,
        address _priceFeed,
        address initialOwner
    ) Ownable(initialOwner) {
        elemToken = IERC20(_elemToken);
        priceFeed = IPriceFeed(_priceFeed);
    }

    /// @notice Stake de tokens ELEM
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Staking: amount must be > 0");

        _updateReward(msg.sender);

        elemToken.safeTransferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /// @notice Retirar tokens do staking
    function withdraw(uint256 amount) external nonReentrant {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount >= amount, "Staking: insufficient balance");

        _updateReward(msg.sender);

        info.amount -= amount;
        totalStaked -= amount;
        elemToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Coletar recompensas acumuladas
    function claimReward() external nonReentrant {
        _updateReward(msg.sender);

        uint256 reward = stakes[msg.sender].rewardDebt;
        require(reward > 0, "Staking: no rewards");

        stakes[msg.sender].rewardDebt = 0;
        elemToken.safeTransfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    /// @notice Visualizar recompensas pendentes
    function pendingReward(address user) external view returns (uint256) {
        StakeInfo memory info = stakes[user];
        if (info.amount == 0) return info.rewardDebt;

        uint256 elapsed = block.timestamp - info.lastUpdate;
        uint256 rate = _adjustedRate();
        uint256 reward = (info.amount * rate * elapsed) / (10000 * 1 days);
        return info.rewardDebt + reward;
    }

    /// @notice Taxa de recompensa ajustada pelo oráculo
    function _adjustedRate() internal view returns (uint256) {
        int256 price = priceFeed.getLatestPrice();
        if (price <= 0) return baseRate;

        // Se preço > referência, taxa diminui. Se preço < referência, taxa aumenta.
        // rate = baseRate * REFERENCE_PRICE / currentPrice
        uint256 adjusted = (baseRate * uint256(REFERENCE_PRICE)) / uint256(price);

        // Limites: mínimo 10 (0.1%), máximo 500 (5%)
        if (adjusted < 10) return 10;
        if (adjusted > 500) return 500;
        return adjusted;
    }

    function _updateReward(address user) internal {
        StakeInfo storage info = stakes[user];
        if (info.amount > 0 && info.lastUpdate > 0) {
            uint256 elapsed = block.timestamp - info.lastUpdate;
            uint256 rate = _adjustedRate();
            uint256 reward = (info.amount * rate * elapsed) / (10000 * 1 days);
            info.rewardDebt += reward;
        }
        info.lastUpdate = block.timestamp;
    }

    /// @notice Atualizar taxa base (owner)
    function setBaseRate(uint256 newRate) external onlyOwner {
        baseRate = newRate;
    }

    /// @notice Atualizar endereço do oráculo (owner)
    function setPriceFeed(address newFeed) external onlyOwner {
        priceFeed = IPriceFeed(newFeed);
    }
}
