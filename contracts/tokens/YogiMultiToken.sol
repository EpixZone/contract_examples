// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title YogiMultiToken
 * @dev ERC1155 token with multiple token types
 * Demonstrates the capabilities of ERC1155 that ERC721 doesn't have:
 * - Multiple token types in a single contract
 * - Batch transfers
 * - Semi-fungible tokens
 * - Gas efficiency for multiple NFTs
 */
contract YogiMultiToken is ERC1155, ERC1155Supply, Ownable {
    using Strings for uint256;
    
    // Token type constants
    uint256 public constant YOGI_COIN = 0;       // Fungible token (like ERC20)
    uint256 public constant YOGI_COMMON = 1;     // Common collectible (semi-fungible)
    uint256 public constant YOGI_RARE = 2;       // Rare collectible (semi-fungible)
    uint256 public constant YOGI_EPIC = 3;       // Epic collectible (semi-fungible)
    uint256 public constant YOGI_LEGENDARY = 4;  // Legendary collectible (semi-fungible)
    uint256 public constant YOGI_UNIQUE = 5;     // Unique item (like ERC721)
    
    // Token type maximum supplies
    mapping(uint256 => uint256) public maxSupply;
    
    // Token URIs
    mapping(uint256 => string) private _tokenURIs;
    
    // Token names
    mapping(uint256 => string) public tokenNames;
    
    // Collection name
    string public name = "Yogi Multi Token Collection";
    string public symbol = "YOGIMT";
    
    // Events
    event TokenTypeCreated(uint256 id, string name, uint256 maxSupply);
    event TokenURISet(uint256 id, string tokenURI);
    event BatchMinted(address indexed to, uint256[] ids, uint256[] amounts);

    /**
     * @dev Constructor
     * @param baseURI The base URI for all token metadata
     */
    constructor(string memory baseURI) ERC1155(baseURI) {
        // Set up token types
        _setupTokenType(YOGI_COIN, "Yogi Coin", 1000000000); // 1 billion fungible tokens
        _setupTokenType(YOGI_COMMON, "Yogi Common", 10000);
        _setupTokenType(YOGI_RARE, "Yogi Rare", 1000);
        _setupTokenType(YOGI_EPIC, "Yogi Epic", 100);
        _setupTokenType(YOGI_LEGENDARY, "Yogi Legendary", 10);
        _setupTokenType(YOGI_UNIQUE, "Yogi Unique", 1);
        
        // Mint some initial tokens to the contract creator
        _mint(msg.sender, YOGI_COIN, 1000000, "");
        _mint(msg.sender, YOGI_COMMON, 10, "");
        _mint(msg.sender, YOGI_RARE, 5, "");
        _mint(msg.sender, YOGI_EPIC, 2, "");
        _mint(msg.sender, YOGI_LEGENDARY, 1, "");
    }

    /**
     * @dev Set up a token type with name and max supply
     * @param id The token type ID
     * @param tokenName The name of the token type
     * @param tokenMaxSupply The maximum supply for this token type
     */
    function _setupTokenType(uint256 id, string memory tokenName, uint256 tokenMaxSupply) private {
        tokenNames[id] = tokenName;
        maxSupply[id] = tokenMaxSupply;
        emit TokenTypeCreated(id, tokenName, tokenMaxSupply);
    }

    /**
     * @dev Create a new token type
     * @param id The token type ID
     * @param tokenName The name of the token type
     * @param tokenMaxSupply The maximum supply for this token type
     */
    function createTokenType(uint256 id, string memory tokenName, uint256 tokenMaxSupply) public onlyOwner {
        require(id > YOGI_UNIQUE, "YogiMultiToken: ID reserved for predefined token types");
        require(maxSupply[id] == 0, "YogiMultiToken: Token type already exists");
        _setupTokenType(id, tokenName, tokenMaxSupply);
    }

    /**
     * @dev Set the URI for a token type
     * @param id The token type ID
     * @param tokenURI The URI for the token metadata
     */
    function setTokenURI(uint256 id, string memory tokenURI) public onlyOwner {
        _tokenURIs[id] = tokenURI;
        emit TokenURISet(id, tokenURI);
    }

    /**
     * @dev Mint tokens
     * @param to The address to mint tokens to
     * @param id The token type ID
     * @param amount The amount of tokens to mint
     * @param data Additional data
     */
    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        require(totalSupply(id) + amount <= maxSupply[id], "YogiMultiToken: Max supply exceeded");
        _mint(to, id, amount, data);
    }

    /**
     * @dev Mint multiple token types at once
     * @param to The address to mint tokens to
     * @param ids Array of token type IDs
     * @param amounts Array of amounts to mint
     * @param data Additional data
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            require(totalSupply(ids[i]) + amounts[i] <= maxSupply[ids[i]], "YogiMultiToken: Max supply exceeded");
        }
        _mintBatch(to, ids, amounts, data);
        emit BatchMinted(to, ids, amounts);
    }

    /**
     * @dev URI for a given token ID
     * @param id The token type ID
     * @return The URI string
     */
    function uri(uint256 id) public view override returns (string memory) {
        if (bytes(_tokenURIs[id]).length > 0) {
            return _tokenURIs[id];
        }
        
        return string(abi.encodePacked(super.uri(id), id.toString()));
    }

    /**
     * @dev Demonstrates batch transfers - a key feature of ERC1155
     * @param from The sender address
     * @param to The recipient address
     * @param ids Array of token type IDs
     * @param amounts Array of amounts to transfer
     */
    function batchTransferDemo(address from, address to, uint256[] memory ids, uint256[] memory amounts) public {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "YogiMultiToken: Caller is not owner nor approved");
        safeBatchTransferFrom(from, to, ids, amounts, "");
    }

    // The following functions are overrides required by Solidity

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
