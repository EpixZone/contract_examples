# Yogi-Themed Smart Contracts for Epix

![Yogi](Yogi.jpg)

This repository contains examples of ERC-20, ERC-721, and ERC-1155 smart contracts designed for the Epix blockchain. All contracts are compatible with Solidity 0.8.18, as Epix does not support Solidity 0.8.20 and above.

## Deployed Contracts (Epix Testnet)

- **YogiToken (ERC-20)**: [0xA84D7bfC3Be1b5B709d4a564933B4A6080D5b583](https://testscan.epix.zone/address/0xA84D7bfC3Be1b5B709d4a564933B4A6080D5b583)
- **YogiNFTCollection (ERC-721)**: [0x5434b91C0a104319B68e66399C1f4d53CEFc0Aa3](https://testscan.epix.zone/address/0x5434b91C0a104319B68e66399C1f4d53CEFc0Aa3)
- **YogiMultiToken (ERC-1155)**: [0xE04461FD106aA44fB55980C97BAc3f07b9c1286d](https://testscan.epix.zone/address/0xE04461FD106aA44fB55980C97BAc3f07b9c1286d)

## Contracts Overview

### 1. YogiToken (ERC-20)

A standard ERC-20 token with the following features:

- Name: Yogi Token
- Symbol: YOGI
- Decimals: 18
- Max Supply: 1,000,000,000 tokens
- Initial Supply: 10% of max supply minted to the deployer
- Burning capability
- Minting capability (owner only)

### 2. YogiNFTCollection (ERC-721)

An NFT collection with the following features:

- Name: Yogi NFT Collection
- Symbol: YOGINFT
- Max Supply: 1,000 NFTs
- Metadata: Customizable base URI
- Minting: Owner can mint for free, public can mint with payment
- Enumerable: Tokens can be enumerated
- Withdrawable: Owner can withdraw funds from the contract

### 3. YogiMultiToken (ERC-1155)

A multi-token contract showcasing ERC-1155 capabilities that ERC-721 doesn't have:

- Multiple token types in a single contract
- Batch transfers
- Semi-fungible tokens
- Gas efficiency for multiple NFTs

Predefined token types:

- YOGI_COIN (ID: 0): Fungible token (like ERC-20)
- YOGI_COMMON (ID: 1): Common collectible (semi-fungible)
- YOGI_RARE (ID: 2): Rare collectible (semi-fungible)
- YOGI_EPIC (ID: 3): Epic collectible (semi-fungible)
- YOGI_LEGENDARY (ID: 4): Legendary collectible (semi-fungible)
- YOGI_UNIQUE (ID: 5): Unique item (like ERC-721)

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/contract_examples.git
   cd contract_examples
   ```

1. Install dependencies:

   ```bash
   npm install
   ```

1. Create a `.env` file with your private key:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and add your private key:

   ```bash
   PRIVATE_KEY=your_private_key_here
   ```

## Deployment

### Deploying to Epix Testnet

**For YogiToken (ERC-20):**

```bash
npx hardhat run scripts/deploy_yogi_token.js --network epixTestnet
```

**For YogiNFTCollection (ERC-721):**

```bash
npx hardhat run scripts/deploy_yogi_nft.js --network epixTestnet
```

**For YogiMultiToken (ERC-1155):**

```bash
npx hardhat run scripts/deploy_yogi_multi_token.js --network epixTestnet
```

### Deploying to Epix Mainnet

Replace `epixTestnet` with `epixMainnet` in the above commands.

## Verification on Block Explorer

The deployment scripts include automatic verification on the Epix block explorer. If verification fails, you can manually verify using:

```bash
npx hardhat verify --network epixTestnet CONTRACT_ADDRESS [CONSTRUCTOR_ARGS]
```

Examples:

```bash
# Verify YogiToken
npx hardhat verify --network epixTestnet 0xA84D7bfC3Be1b5B709d4a564933B4A6080D5b583

# Verify YogiNFTCollection
npx hardhat verify --network epixTestnet 0x5434b91C0a104319B68e66399C1f4d53CEFc0Aa3

# Verify YogiMultiToken
npx hardhat verify --network epixTestnet 0xE04461FD106aA44fB55980C97BAc3f07b9c1286d "https://ipfs.io/ipfs/QmYogi/"
```

## Testing

Run tests locally:

```bash
npx hardhat test
```

Run specific test:

```bash
npx hardhat test test/YogiToken.test.js
npx hardhat test test/YogiNFTCollection.test.js
npx hardhat test test/YogiMultiToken.test.js
```

## Interacting with Contracts

### YogiToken (ERC-20)

#### Minting Tokens (Owner Only)

```javascript
// Mint 1000 tokens to an address
await yogiToken.mint("0xRecipientAddress", ethers.utils.parseEther("1000"));
```

#### Transferring Tokens

```javascript
// Transfer 100 tokens to another address
await yogiToken.transfer("0xRecipientAddress", ethers.utils.parseEther("100"));
```

#### Burning Tokens

```javascript
// Burn 50 tokens from your balance
await yogiToken.burn(ethers.utils.parseEther("50"));
```

### YogiNFTCollection (ERC-721)

#### Minting NFTs (Owner Only)

```javascript
// Mint an NFT to an address with a specific token URI
await yogiNFT.safeMint("0xRecipientAddress", "ipfs://QmYourCID/1.json");
```

#### Public Minting (With Payment)

```javascript
// Mint an NFT by paying the mint price
await yogiNFT.publicMint("ipfs://QmYourCID/1.json", { value: ethers.utils.parseEther("0.01") });
```

#### Setting Base URI

```javascript
// Set the base URI for all tokens
await yogiNFT.setBaseURI("ipfs://QmYourCID/");
```

### YogiMultiToken (ERC-1155)

#### Minting Tokens

```javascript
// Mint 100 YOGI_COIN tokens to an address
await yogiMultiToken.mint("0xRecipientAddress", 0, 100, "0x");

// Mint 5 YOGI_RARE tokens to an address
await yogiMultiToken.mint("0xRecipientAddress", 2, 5, "0x");
```

#### Batch Minting

```javascript
// Mint multiple token types at once
await yogiMultiToken.mintBatch(
  "0xRecipientAddress",
  [0, 1, 2],  // Token IDs
  [100, 10, 5],  // Amounts
  "0x"  // Data
);
```

#### Batch Transfers

```javascript
// Transfer multiple token types at once
await yogiMultiToken.batchTransferDemo(
  "0xSenderAddress",
  "0xRecipientAddress",
  [0, 1],  // Token IDs
  [50, 5]  // Amounts
);
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
