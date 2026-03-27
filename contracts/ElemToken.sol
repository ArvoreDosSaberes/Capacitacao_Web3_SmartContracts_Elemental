// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ElemToken
 * @dev Token ERC-20 de utilidade do protocolo Elemental.
 *      Usado para staking, recompensas e governança (DAO).
 */
contract ElemToken is ERC20, ERC20Burnable, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10 ** 18;

    constructor(address initialOwner)
        ERC20("Elemental Token", "ELEM")
        Ownable(initialOwner)
    {
        _mint(initialOwner, MAX_SUPPLY);
    }

    /// @notice Mint adicional restrito ao owner (ex.: contrato de staking)
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "ElemToken: exceeds max supply");
        _mint(to, amount);
    }

    /// @notice Pausa todas as transferências (emergência)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Retoma transferências
    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override
        whenNotPaused
    {
        super._update(from, to, value);
    }
}
