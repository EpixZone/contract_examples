// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title YogiNFTCollection
 * @dev ERC721 token with minting capabilities and metadata
 */
contract YogiNFTCollection is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    // Token ID counter
    Counters.Counter private _tokenIdCounter;

    // Maximum supply of NFTs
    uint256 public constant MAX_SUPPLY = 1000;

    // Base URI for metadata
    string private _baseTokenURI;

    // Mint price
    uint256 public mintPrice = 0.01 ether;

    // Events
    event NFTMinted(address indexed to, uint256 tokenId, string tokenURI);
    event BaseURIChanged(string newBaseURI);
    event MintPriceChanged(uint256 newPrice);

    /**
     * @dev Constructor
     */
    constructor() ERC721("Yogi NFT Collection", "YOGINFT") {
        _baseTokenURI = "";
    }

    /**
     * @dev Mint a new NFT
     * @param to The address that will receive the minted token
     * @param uri The token URI for the new token
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        require(
            _tokenIdCounter.current() < MAX_SUPPLY,
            "YogiNFTCollection: Max supply reached"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(to, tokenId, uri);
    }

    /**
     * @dev Public mint function with payment
     * @param uri The token URI for the new token
     */
    function publicMint(string memory uri) public payable {
        require(
            msg.value >= mintPrice,
            "YogiNFTCollection: Insufficient payment"
        );
        require(
            _tokenIdCounter.current() < MAX_SUPPLY,
            "YogiNFTCollection: Max supply reached"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(msg.sender, tokenId, uri);
    }

    /**
     * @dev Set the base URI for all token IDs
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    /**
     * @dev Set the mint price
     * @param newPrice The new mint price
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
        emit MintPriceChanged(newPrice);
    }

    /**
     * @dev Withdraw funds from the contract
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Base URI for computing {tokenURI}
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // The following functions are overrides required by Solidity

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
