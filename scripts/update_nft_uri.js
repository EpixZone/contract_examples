// Script to update the token URI for the YogiNFTCollection (ERC-721) contract
const hre = require("hardhat");

async function main() {
  console.log("Updating token URI for YogiNFTCollection (ERC-721)...");

  // Contract address from deployment
  const yogiNFTAddress = "0x5434b91C0a104319B68e66399C1f4d53CEFc0Aa3";
  
  // Get the contract instance
  const YogiNFTCollection = await hre.ethers.getContractFactory("YogiNFTCollection");
  const yogiNFT = YogiNFTCollection.attach(yogiNFTAddress);

  // Set the base URI for the NFT collection
  const baseURI = "https://raw.githubusercontent.com/EpixZone/contract_examples/main/metadata/";
  const setBaseURITx = await yogiNFT.setBaseURI(baseURI);
  await setBaseURITx.wait();
  console.log(`Base URI updated to: ${baseURI}`);
  
  // Get the token URI for token ID 0 (the one we minted during deployment)
  const tokenURI = await yogiNFT.tokenURI(0);
  console.log(`Token URI for token ID 0: ${tokenURI}`);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
