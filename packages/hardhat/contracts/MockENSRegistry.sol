// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MockENSRegistry
 * @dev A simple mock ENS registry for local testing
 */
contract MockENSRegistry {
    mapping(bytes32 => address) private _owners;
    mapping(bytes32 => address) private _resolvers;
    
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);
    event Transfer(bytes32 indexed node, address owner);
    event NewResolver(bytes32 indexed node, address resolver);
    
    constructor() {
        // Set the root node owner to the deployer
        bytes32 rootNode = 0x0000000000000000000000000000000000000000000000000000000000000000;
        _owners[rootNode] = msg.sender;
    }
    
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external returns (bytes32) {
        bytes32 subnode = keccak256(abi.encodePacked(node, label));
        _owners[subnode] = owner;
        emit NewOwner(node, label, owner);
        return subnode;
    }
    
    function setResolver(bytes32 node, address resolver) external {
        require(_owners[node] == msg.sender, "Not authorized");
        _resolvers[node] = resolver;
        emit NewResolver(node, resolver);
    }
    
    function owner(bytes32 node) external view returns (address) {
        return _owners[node];
    }
    
    function resolver(bytes32 node) external view returns (address) {
        return _resolvers[node];
    }
} 