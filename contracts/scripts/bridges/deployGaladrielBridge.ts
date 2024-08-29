import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initialGalBalance = ethers.parseEther("1"); // Specify the initial GAL balance to deposit during deployment

  const GaladrielBridge = await ethers.getContractFactory("GaladrielBridge");
  const galadrielBridge = await GaladrielBridge.deploy({
    value: initialGalBalance,
  });

  console.log(
    "GaladrielBridge contract deployed to:",
    await galadrielBridge.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
