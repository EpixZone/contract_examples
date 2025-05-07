// Script to deploy the YogiNFTCollection (ERC-721) contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying YogiNFTCollection (ERC-721)...");

  // Deploy the contract
  const YogiNFTCollection = await hre.ethers.getContractFactory("YogiNFTCollection");
  const deployTx = await YogiNFTCollection.deploy();

  console.log("Waiting for deployment transaction...");
  const yogiNFT = await deployTx.waitForDeployment();
  const yogiNFTAddress = await yogiNFT.getAddress();

  console.log(`YogiNFTCollection deployed to: ${yogiNFTAddress}`);

  // Set the base URI for the NFT collection
  const baseURI = "https://ipfs.io/ipfs/QmYogi/";
  const setBaseURITx = await yogiNFT.setBaseURI(baseURI);
  await setBaseURITx.wait();
  console.log(`Base URI set to: ${baseURI}`);

  // Mint a sample NFT to the deployer
  const [deployer] = await hre.ethers.getSigners();
  const mintTx = await yogiNFT.safeMint(deployer.address, "1.json");
  await mintTx.wait();
  console.log(`Sample NFT minted to: ${deployer.address}`);

  // Wait for a few seconds to ensure the contract is properly deployed
  console.log("Waiting for a few seconds...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the contract on Epix block explorer
  console.log("Verifying contract on Epix block explorer...");
  try {
    await hre.run("verify:verify", {
      address: yogiNFTAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
