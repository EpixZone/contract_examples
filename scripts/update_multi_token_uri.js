// Script to update the token URIs for the YogiMultiToken (ERC-1155) contract
const hre = require("hardhat");

async function main() {
  console.log("Updating token URIs for YogiMultiToken (ERC-1155)...");

  // Contract address from deployment
  const yogiMultiTokenAddress = "0xE04461FD106aA44fB55980C97BAc3f07b9c1286d";
  
  // Get the contract instance
  const YogiMultiToken = await hre.ethers.getContractFactory("YogiMultiToken");
  const yogiMultiToken = YogiMultiToken.attach(yogiMultiTokenAddress);

  // Set specific URIs for each token type
  const baseURI = "https://raw.githubusercontent.com/EpixZone/contract_examples/main/metadata/";
  
  console.log("Setting token URIs...");
  
  const setURI0 = await yogiMultiToken.setTokenURI(0, `${baseURI}yogi_coin.json`);
  await setURI0.wait();
  console.log("Set URI for token ID 0 (Yogi Coin)");
  
  const setURI1 = await yogiMultiToken.setTokenURI(1, `${baseURI}yogi_common.json`);
  await setURI1.wait();
  console.log("Set URI for token ID 1 (Yogi Common)");
  
  const setURI2 = await yogiMultiToken.setTokenURI(2, `${baseURI}yogi_rare.json`);
  await setURI2.wait();
  console.log("Set URI for token ID 2 (Yogi Rare)");
  
  const setURI3 = await yogiMultiToken.setTokenURI(3, `${baseURI}yogi_epic.json`);
  await setURI3.wait();
  console.log("Set URI for token ID 3 (Yogi Epic)");
  
  const setURI4 = await yogiMultiToken.setTokenURI(4, `${baseURI}yogi_legendary.json`);
  await setURI4.wait();
  console.log("Set URI for token ID 4 (Yogi Legendary)");
  
  const setURI5 = await yogiMultiToken.setTokenURI(5, `${baseURI}yogi_unique.json`);
  await setURI5.wait();
  console.log("Set URI for token ID 5 (Yogi Unique)");
  
  const setURI6 = await yogiMultiToken.setTokenURI(6, `${baseURI}yogi_special.json`);
  await setURI6.wait();
  console.log("Set URI for token ID 6 (Yogi Special Edition)");
  
  console.log("All token URIs updated successfully!");
  
  // Get the URI for token ID 0 to verify
  const uri0 = await yogiMultiToken.uri(0);
  console.log(`URI for token ID 0: ${uri0}`);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
