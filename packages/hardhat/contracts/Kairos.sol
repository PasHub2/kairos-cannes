// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/Counters.sol";

contract Kairos is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct KairosMoment {
        string tokenURI;
        uint256 timestamp;
        address owner;
    }

    event MomentCreated(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 timestamp
    );

    mapping(uint256 => KairosMoment) private _moments;

    constructor(address initialOwner)
        ERC721("Kairos Moment", "KAIROS")
        Ownable(initialOwner)
    {}

    function mintMoment(string memory _tokenURI, uint256 _timestamp) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);

        _moments[tokenId] = KairosMoment({
            tokenURI: _tokenURI,
            timestamp: _timestamp,
            owner: msg.sender
        });

        emit MomentCreated(msg.sender, tokenId, _tokenURI, _timestamp);
    }

    // Returns the metadata URI for a given token
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        // *** FINALE ÄNDERUNG HIER ***
        // Ruft ownerOf auf, um zu prüfen, ob das Token existiert.
        // Schlägt fehl, wenn nicht, was dem alten "require" entspricht.
        ownerOf(tokenId);

        return string.concat("ipfs://", _moments[tokenId].tokenURI);
    }
}