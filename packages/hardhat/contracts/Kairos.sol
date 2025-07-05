// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Kairos is ERC721, Ownable {
    // Data structure for a Kairos Moment
    struct KairosMoment {
        uint256 id;
        string imageCID;
        uint256 timestamp;
        address owner;
    }

    // Event for the creation of a new Moment
    event MomentCreated(
        address indexed owner,
        uint256 indexed momentId,
        string imageCID,
        uint256 timestamp
    );

    // State variables
    uint256 private _momentCounter; // This will serve as the next ERC721 tokenId
    mapping(uint256 => KairosMoment) private _moments;
    mapping(address => uint256[]) private _momentsByOwner;

    // Mapping from address to nickname (from previous YourContract.sol)
    mapping(address => string) public nicknames;

    constructor(address initialOwner)
        ERC721("Kairos Moment", "KAIROS") // ERC721 Name and Symbol
        Ownable(initialOwner)
    {
        _momentCounter = 0; // Initialize counter
    }

    // Function to allow users to set their nickname (from previous YourContract.sol)
    function setNickname(string memory newNickname) public {
        nicknames[msg.sender] = newNickname;
    }

    // Function to create and mint a new Moment (updated with imageCID and timestamp)
    function mintMoment(string memory _imageCID, uint256 _timestamp) public {
        uint256 tokenId = _momentCounter; // Use current counter for tokenId
        _safeMint(msg.sender, tokenId); // Mint the NFT to the caller

        KairosMoment memory newMoment = KairosMoment({
            id: tokenId, // Use the minted tokenId
            imageCID: _imageCID,
            timestamp: _timestamp,
            owner: msg.sender
        });

        _moments[tokenId] = newMoment;
        _momentsByOwner[msg.sender].push(tokenId);
        emit MomentCreated(msg.sender, tokenId, _imageCID, _timestamp);

        _momentCounter++; // Increment counter for the next moment
    }

    // Getter function for all Moments of an owner
    function getMomentsByOwner(address _owner) public view returns (uint256[] memory) {
        return _momentsByOwner[_owner];
    }

    // Override the ERC721 tokenURI to return a placeholder for now
    // This will be updated later with actual metadata
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);
        return string.concat("ipfs://", _moments[tokenId].imageCID); // For now, directly link to CID
    }
}