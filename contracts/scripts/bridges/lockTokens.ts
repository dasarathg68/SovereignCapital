// Interact with SepoliaBridge to lock tokens
import { ethers } from "hardhat";
async function lockTokensOnSepolia() {
  const [deployer] = await ethers.getSigners();
  const sepoliaBridgeAddress = "0x45b62FDc67a2Fa5B6bbC0fCB27A781580ddF6271";
  const galadrielBridgeAddress = "0x6f7153684c057e6c0b07a3DD32DA95eDCE7Ead8b";

  const sepoliaBridge = await ethers.getContractAt(
    "Bridge",
    sepoliaBridgeAddress,
    deployer
  );

  const amountToLock = ethers.parseEther("0.01"); // Specify the amount to lock

  const tx = await sepoliaBridge.lockTokens(
    amountToLock,
    "Galadriel",
    galadrielBridgeAddress,
    { value: amountToLock }
  );

  await tx.wait();
  console.log("Tokens locked on SepoliaBridge");
}

lockTokensOnSepolia();
