// Interact with SepoliaBridge to lock tokens
import { ethers } from "hardhat";
async function lockTokensOnSepolia() {
  const [deployer] = await ethers.getSigners();
  const sepoliaBridgeAddress = "0x370C7F7DB87124B4056b6bC986215718E521a997";
  const galadrielBridgeAddress = "0xf5B9090676474D9FA21cd9B70019E756ceE19eAf";

  const sepoliaBridge = await ethers.getContractAt(
    "SepoliaBridge",
    sepoliaBridgeAddress,
    deployer
  );

  const tx = await sepoliaBridge.lockTokens(
    "Galadriel",
    galadrielBridgeAddress,
    {
      value: ethers.parseEther("0.001"),
    }
  );
  await tx.wait();
  console.log("Tokens locked on SepoliaBridge");
}

lockTokensOnSepolia();
