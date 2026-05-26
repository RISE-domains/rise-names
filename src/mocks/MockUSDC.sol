// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC20} from "solady/tokens/ERC20.sol";

/// @notice Testnet USDC mock. Anyone can mint — for development only.
contract MockUSDC is ERC20 {
    function name() public pure override returns (string memory) {
        return "Mock USDC";
    }

    function symbol() public pure override returns (string memory) {
        return "MOCKUSDC";
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /// @notice Mint any amount to any address. Not access-controlled by design.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
