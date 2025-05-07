// Script to deploy the YogiToken (ERC-20) contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying YogiToken (ERC-20)...");

  // Deploy the contract
  const YogiToken = await hre.ethers.getContractFactory("YogiToken");
  const deployTx = await YogiToken.deploy();

  console.log("Waiting for deployment transaction...");
  const yogiToken = await deployTx.waitForDeployment();
  const yogiTokenAddress = await yogiToken.getAddress();

  console.log(`YogiToken deployed to: ${yogiTokenAddress}`);

  // Wait for a few seconds to ensure the contract is properly deployed
  console.log("Waiting for a few seconds...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the contract on Epix block explorer
  console.log("Verifying contract on Epix block explorer...");
  try {
    await hre.run("verify:verify", {
      address: yogiTokenAddress,
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
