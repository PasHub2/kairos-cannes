// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

contract ENSRegistrar {
    ENS public ens;
    bytes32 public rootNode;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    // The constructor now handles all setup atomically.
    constructor(address _ensAddress) {
        owner = msg.sender;
        ens = ENS(_ensAddress);

        // 1. Calculate the node for 'kairos.eth'
        rootNode = keccak256(abi.encodePacked(keccak256(abi.encodePacked(bytes32(0), keccak256("eth"))), keccak256("kairos")));

        // 2. The deployer (owner) sets this contract as the owner of the 'kairos.eth' node.
        // This grants the contract permission to create subdomains.
        ens.setSubnodeOwner(keccak256(abi.encodePacked(bytes32(0), keccak256("eth"))), keccak256("kairos"), address(this));
    }

    // The register function is now protected.
    function register(string calldata label, address newOwner) external {
        bytes32 labelHash = keccak256(bytes(label));
        ens.setSubnodeOwner(rootNode, labelHash, newOwner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}