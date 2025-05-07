const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("YogiToken", function () {
  let yogiToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const YogiToken = await ethers.getContractFactory("YogiToken");
    yogiToken = await YogiToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await yogiToken.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await yogiToken.balanceOf(owner.address);
      expect(await yogiToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await yogiToken.name()).to.equal("Yogi Token");
      expect(await yogiToken.symbol()).to.equal("YOGI");
    });

    it("Should have 18 decimals", async function () {
      expect(await yogiToken.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await yogiToken.transfer(addr1.address, 50);
      const addr1Balance = await yogiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await yogiToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await yogiToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await yogiToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner
      await expect(
        yogiToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await yogiToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      await yogiToken.mint(addr1.address, 1000);
      expect(await yogiToken.balanceOf(addr1.address)).to.equal(1000);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      await expect(
        yogiToken.connect(addr1).mint(addr1.address, 1000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow minting beyond max supply", async function () {
      // Just use a very large number that's guaranteed to exceed max supply
      const hugeAmount = "1000000000000000000000000000000";

      await expect(
        yogiToken.mint(addr1.address, hugeAmount)
      ).to.be.revertedWith("YogiToken: Max supply exceeded");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      // Transfer some tokens to addr1
      await yogiToken.transfer(addr1.address, 1000);

      // Burn 500 tokens
      await yogiToken.connect(addr1).burn(500);

      // Check balance
      expect(await yogiToken.balanceOf(addr1.address)).to.equal(500);
    });
  });
});
