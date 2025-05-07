const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("YogiMultiToken", function () {
  let yogiMultiToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // Token type constants
  const YOGI_COIN = 0;
  const YOGI_COMMON = 1;
  const YOGI_RARE = 2;
  const YOGI_EPIC = 3;
  const YOGI_LEGENDARY = 4;
  const YOGI_UNIQUE = 5;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const YogiMultiToken = await ethers.getContractFactory("YogiMultiToken");
    yogiMultiToken = await YogiMultiToken.deploy("https://api.example.com/tokens/");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await yogiMultiToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await yogiMultiToken.name()).to.equal("Yogi Multi Token Collection");
      expect(await yogiMultiToken.symbol()).to.equal("YOGIMT");
    });

    it("Should set up predefined token types with correct max supplies", async function () {
      expect(await yogiMultiToken.maxSupply(YOGI_COIN)).to.equal(1000000000);
      expect(await yogiMultiToken.maxSupply(YOGI_COMMON)).to.equal(10000);
      expect(await yogiMultiToken.maxSupply(YOGI_RARE)).to.equal(1000);
      expect(await yogiMultiToken.maxSupply(YOGI_EPIC)).to.equal(100);
      expect(await yogiMultiToken.maxSupply(YOGI_LEGENDARY)).to.equal(10);
      expect(await yogiMultiToken.maxSupply(YOGI_UNIQUE)).to.equal(1);
    });

    it("Should mint initial tokens to the owner", async function () {
      expect(await yogiMultiToken.balanceOf(owner.address, YOGI_COIN)).to.equal(1000000);
      expect(await yogiMultiToken.balanceOf(owner.address, YOGI_COMMON)).to.equal(10);
      expect(await yogiMultiToken.balanceOf(owner.address, YOGI_RARE)).to.equal(5);
      expect(await yogiMultiToken.balanceOf(owner.address, YOGI_EPIC)).to.equal(2);
      expect(await yogiMultiToken.balanceOf(owner.address, YOGI_LEGENDARY)).to.equal(1);
    });
  });

  describe("Token URI", function () {
    it("Should return the correct URI for tokens", async function () {
      // Default URI
      expect(await yogiMultiToken.uri(YOGI_COIN)).to.equal("https://api.example.com/tokens/0");

      // Set a specific URI
      await yogiMultiToken.setTokenURI(YOGI_COIN, "https://api.example.com/tokens/coin.json");
      expect(await yogiMultiToken.uri(YOGI_COIN)).to.equal("https://api.example.com/tokens/coin.json");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      await yogiMultiToken.mint(addr1.address, YOGI_COIN, 1000, "0x");
      expect(await yogiMultiToken.balanceOf(addr1.address, YOGI_COIN)).to.equal(1000);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      await expect(
        yogiMultiToken.connect(addr1).mint(addr1.address, YOGI_COIN, 1000, "0x")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow minting beyond max supply", async function () {
      // For YOGI_UNIQUE, the max supply is 1, so trying to mint 2 should fail
      await expect(
        yogiMultiToken.mint(addr1.address, YOGI_UNIQUE, 2, "0x")
      ).to.be.revertedWith("YogiMultiToken: Max supply exceeded");
    });

    it("Should allow batch minting", async function () {
      const ids = [YOGI_COIN, YOGI_COMMON, YOGI_RARE];
      const amounts = [1000, 5, 2];

      await yogiMultiToken.mintBatch(addr1.address, ids, amounts, "0x");

      expect(await yogiMultiToken.balanceOf(addr1.address, YOGI_COIN)).to.equal(1000);
      expect(await yogiMultiToken.balanceOf(addr1.address, YOGI_COMMON)).to.equal(5);
      expect(await yogiMultiToken.balanceOf(addr1.address, YOGI_RARE)).to.equal(2);
    });
  });

  describe("Token Type Creation", function () {
    it("Should allow owner to create new token types", async function () {
      await yogiMultiToken.createTokenType(10, "Yogi Special", 100);

      expect(await yogiMultiToken.maxSupply(10)).to.equal(100);
      expect(await yogiMultiToken.tokenNames(10)).to.equal("Yogi Special");
    });

    it("Should not allow creating token types with reserved IDs", async function () {
      await expect(
        yogiMultiToken.createTokenType(YOGI_UNIQUE, "Test", 100)
      ).to.be.revertedWith("YogiMultiToken: ID reserved for predefined token types");
    });

    it("Should not allow creating token types that already exist", async function () {
      await yogiMultiToken.createTokenType(10, "Yogi Special", 100);

      await expect(
        yogiMultiToken.createTokenType(10, "Yogi Special 2", 200)
      ).to.be.revertedWith("YogiMultiToken: Token type already exists");
    });
  });

  describe("Batch Transfers", function () {
    it("Should allow batch transfers", async function () {
      // First mint some tokens to addr1
      const ids = [YOGI_COIN, YOGI_COMMON];
      const amounts = [1000, 5];

      await yogiMultiToken.mintBatch(addr1.address, ids, amounts, "0x");

      // Now transfer from addr1 to addr2
      await yogiMultiToken.connect(addr1).batchTransferDemo(
        addr1.address,
        addr2.address,
        ids,
        [500, 2]
      );

      // Check balances
      expect(await yogiMultiToken.balanceOf(addr1.address, YOGI_COIN)).to.equal(500);
      expect(await yogiMultiToken.balanceOf(addr1.address, YOGI_COMMON)).to.equal(3);
      expect(await yogiMultiToken.balanceOf(addr2.address, YOGI_COIN)).to.equal(500);
      expect(await yogiMultiToken.balanceOf(addr2.address, YOGI_COMMON)).to.equal(2);
    });
  });
});
