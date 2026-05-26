// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {NameNFT} from "../src/NameNFT.sol";
import {SubdomainRegistrar} from "../src/SubdomainRegistrar.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";

/// @notice Deploys NameNFT + SubdomainRegistrar.
///
/// Local / testnet (no PAYMENT_TOKEN set):
///   forge script script/Deploy.s.sol --rpc-url <rpc> --broadcast
///   Deploys MockUSDC automatically.
///
/// Production (real stablecoin):
///   PAYMENT_TOKEN=0x... forge script script/Deploy.s.sol --rpc-url <rpc> --broadcast
///
/// Optional overrides (env vars):
///   FEE_RECIPIENT   — treasury address (defaults to deployer)
contract Deploy is Script {
    // ── Fee schedule (18 decimals) ────────────────────────────────────────────
    uint256 constant FEE_1_CHAR  = 640e18;  // $640
    uint256 constant FEE_2_CHAR  = 160e18;  // $160
    uint256 constant FEE_3_CHAR  = 40e18;   // $40
    uint256 constant FEE_4_CHAR  = 5e18;    // $5
    uint256 constant FEE_DEFAULT = 1e18;    // $1  (5+ chars)

    // ── Dutch auction settings ────────────────────────────────────────────────
    uint256 constant MAX_PREMIUM    = 100e18;   // $100 starting premium
    uint256 constant DECAY_PERIOD   = 21 days;

    function run() external {
        address deployer = msg.sender;
        address paymentToken = vm.envOr("PAYMENT_TOKEN", address(0));
        address feeRecipient = vm.envOr("FEE_RECIPIENT", deployer);

        vm.startBroadcast();

        // ── 1. Payment token ─────────────────────────────────────────────────
        MockUSDC mockUsdc;
        if (paymentToken == address(0)) {
            mockUsdc = new MockUSDC();
            paymentToken = address(mockUsdc);
            console.log("MockUSDC deployed:", paymentToken);
        } else {
            console.log("Using existing payment token:", paymentToken);
        }

        // ── 2. NameNFT ───────────────────────────────────────────────────────
        NameNFT nameNFT = new NameNFT(paymentToken, feeRecipient);
        console.log("NameNFT deployed:", address(nameNFT));

        // ── 3. SubdomainRegistrar ────────────────────────────────────────────
        SubdomainRegistrar registrar = new SubdomainRegistrar(address(nameNFT), paymentToken);
        console.log("SubdomainRegistrar deployed:", address(registrar));

        // ── 4. Fee schedule ──────────────────────────────────────────────────
        nameNFT.setDefaultFee(FEE_DEFAULT);

        uint256[] memory lengths = new uint256[](4);
        uint256[] memory fees    = new uint256[](4);
        lengths[0] = 1; fees[0] = FEE_1_CHAR;
        lengths[1] = 2; fees[1] = FEE_2_CHAR;
        lengths[2] = 3; fees[2] = FEE_3_CHAR;
        lengths[3] = 4; fees[3] = FEE_4_CHAR;
        nameNFT.setLengthFees(lengths, fees);

        // ── 5. Dutch auction ─────────────────────────────────────────────────
        nameNFT.setPremiumSettings(MAX_PREMIUM, DECAY_PERIOD);

        vm.stopBroadcast();

        // ── Summary ──────────────────────────────────────────────────────────
        console.log("\n=== Deployment Summary ===");
        console.log("Chain ID:           ", block.chainid);
        console.log("Deployer:           ", deployer);
        console.log("Fee recipient:      ", feeRecipient);
        console.log("Payment token:      ", paymentToken);
        console.log("NameNFT:            ", address(nameNFT));
        console.log("SubdomainRegistrar: ", address(registrar));
    }
}
