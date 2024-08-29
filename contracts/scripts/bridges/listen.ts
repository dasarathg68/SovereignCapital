import { ethers } from "hardhat";

async function main() {
  const sepoliaBridgeAddress = "0x370C7F7DB87124B4056b6bC986215718E521a997";
  const galadrielBridgeAddress = "0xf5B9090676474D9FA21cd9B70019E756ceE19eAf";

  const SepoliaBridge = await ethers.getContractFactory("SepoliaBridge");
  const GaladrielBridge = await ethers.getContractFactory("GaladrielBridge");

  const sepoliaBridge = SepoliaBridge.attach(sepoliaBridgeAddress);

  const galadrielBridge = GaladrielBridge.attach(galadrielBridgeAddress);

  sepoliaBridge.on(
    "TokensLocked",
    async (user: any, amount: any, targetChain: string, targetAddress: any) => {
      console.log(
        `TokensLocked detected: ${amount} tokens locked by ${user} on Sepolia for ${targetChain}`
      );

      if (targetChain === "Galadriel") {
        const tx = await galadrielBridge.mintOnChain(targetAddress, amount);
        await tx.wait();
        console.log(
          `Minted ${amount} tokens on Galadriel for ${targetAddress}`
        );
      }
    }
  );

  galadrielBridge.on(
    "TokensBurned",
    async (user: any, amount: any, targetChain: string, targetAddress: any) => {
      console.log(
        `TokensBurned detected: ${amount} tokens burned by ${user} on Galadriel for ${targetChain}`
      );

      if (targetChain === "Sepolia") {
        const tx = await sepoliaBridge.requestUnlock(targetAddress, amount);
        await tx.wait();
        console.log(
          `Requested unlock of ${amount} tokens on Sepolia for ${targetAddress}`
        );
      }
    }
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
