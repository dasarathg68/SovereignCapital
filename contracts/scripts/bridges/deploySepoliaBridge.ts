// scripts/deploy.js
import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SepoliaBridge = await ethers.getContractFactory("SepoliaBridge");
  const sepoliaBridge = await SepoliaBridge.deploy();

  console.log(
    "SepoliaBridge contract deployed to:",
    await sepoliaBridge.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
