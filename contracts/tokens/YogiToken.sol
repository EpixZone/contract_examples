// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YogiToken
 * @dev ERC20 token with burning and minting capabilities
 */
contract YogiToken is ERC20, ERC20Burnable, Ownable {
    // Maximum supply of tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @dev Constructor that gives the msg.sender an initial supply of tokens
     */
    constructor() ERC20("Yogi Token", "YOGI") {
        // Mint 10% of max supply to the contract creator
        _mint(msg.sender, MAX_SUPPLY / 10);
    }

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     * @return A boolean that indicates if the operation was successful
     */
    function mint(address to, uint256 amount) public onlyOwner returns (bool) {
        require(totalSupply() + amount <= MAX_SUPPLY, "YogiToken: Max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
        return true;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
