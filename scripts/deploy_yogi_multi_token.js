// Script to deploy the YogiMultiToken (ERC-1155) contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying YogiMultiToken (ERC-1155)...");

  // Base URI for token metadata
  const baseURI = "https://ipfs.io/ipfs/QmYogi/";

  // Deploy the contract
  const YogiMultiToken = await hre.ethers.getContractFactory("YogiMultiToken");
  const deployTx = await YogiMultiToken.deploy(baseURI);

  console.log("Waiting for deployment transaction...");
  const yogiMultiToken = await deployTx.waitForDeployment();
  const yogiMultiTokenAddress = await yogiMultiToken.getAddress();

  console.log(`YogiMultiToken deployed to: ${yogiMultiTokenAddress}`);

  // Set specific URIs for each token type
  const setURI0 = await yogiMultiToken.setTokenURI(0, `${baseURI}yogi_coin.json`);
  await setURI0.wait();

  const setURI1 = await yogiMultiToken.setTokenURI(1, `${baseURI}yogi_common.json`);
  await setURI1.wait();

  const setURI2 = await yogiMultiToken.setTokenURI(2, `${baseURI}yogi_rare.json`);
  await setURI2.wait();

  const setURI3 = await yogiMultiToken.setTokenURI(3, `${baseURI}yogi_epic.json`);
  await setURI3.wait();

  const setURI4 = await yogiMultiToken.setTokenURI(4, `${baseURI}yogi_legendary.json`);
  await setURI4.wait();

  const setURI5 = await yogiMultiToken.setTokenURI(5, `${baseURI}yogi_unique.json`);
  await setURI5.wait();

  console.log("Token URIs set for all predefined token types");

  // Create a custom token type
  const createTokenTx = await yogiMultiToken.createTokenType(6, "Yogi Special Edition", 50);
  await createTokenTx.wait();

  const setURI6 = await yogiMultiToken.setTokenURI(6, `${baseURI}yogi_special.json`);
  await setURI6.wait();

  console.log("Created custom token type: Yogi Special Edition");

  // Wait for a few seconds to ensure the contract is properly deployed
  console.log("Waiting for a few seconds...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the contract on Epix block explorer
  console.log("Verifying contract on Epix block explorer...");
  try {
    await hre.run("verify:verify", {
      address: yogiMultiTokenAddress,
      constructorArguments: [baseURI],
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
