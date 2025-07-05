// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// We are repurposing YourContract to be our Kairos contract
contract YourContract is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping from address to nickname
    mapping(address => string) public nicknames;

    constructor(address initialOwner)
        ERC721("Kairos Moment", "KAIROS") // We name the token here
        Ownable(initialOwner)
    {}

    // Function to allow users to set their nickname
    function setNickname(string memory newNickname) public {
        nicknames[msg.sender] = newNickname;
    }

    // Placeholder for our future minting function
    function mintMoment(address to) public {
        require(owner() == _msgSender(), "Only owner can mint for now");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}