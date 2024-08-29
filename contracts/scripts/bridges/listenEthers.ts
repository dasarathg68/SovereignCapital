import { ethers } from "ethers";
import GaladrielBridgeABI from "../../artifacts/contracts/bridges/GaladrielBridge.sol/GaladrielBridge.json";
import SepoliaBridgeABI from "../../artifacts/contracts/bridges/SepoliaBridge.sol/SepoliaBridge.json";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const sepoliaBridgeAddress = "0x370C7F7DB87124B4056b6bC986215718E521a997";
  const galadrielBridgeAddress = "0xDdeFb0A59A25b4554EfEb4Ba7Cc7bb3535b49600";

  const sepoliaProvider = new ethers.JsonRpcProvider(
    process.env.SEPOLIA_URL as string
  );
  const galadrielProvider = new ethers.JsonRpcProvider(
    "https://devnet.galadriel.com"
  );

  const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY_LOCALHOST as string,
    sepoliaProvider
  );
  const signerGal = new ethers.Wallet(
    process.env.PRIVATE_KEY_GALADRIEL as string,
    galadrielProvider
  );

  const SepoliaBridge = new ethers.Contract(
    sepoliaBridgeAddress,
    SepoliaBridgeABI.abi,
    sepoliaProvider
  ).connect(signer);

  const GaladrielBridge = new ethers.Contract(
    galadrielBridgeAddress,
    GaladrielBridgeABI.abi,
    galadrielProvider
  ).connect(signerGal);
  const galContract = new ethers.Contract(
    galadrielBridgeAddress,
    GaladrielBridgeABI.abi,
    signerGal
  );
  SepoliaBridge.on(
    "TokensLocked",
    async (
      user: string,
      amount: any,
      targetChain: string,
      targetAddress: string
    ) => {
      console.log(
        `TokensLocked detected: ${ethers.formatEther(
          amount
        )} tokens locked by ${user} on Sepolia for ${targetChain}`
      );

      if (targetChain === "Galadriel") {
        try {
          //   console.log(await contract.admin());
          const tx = await galContract.mintOnChain(targetAddress, amount);
          await tx.wait();
          console.log(
            `Minted ${ethers.formatEther(
              amount
            )} tokens on Galadriel for ${targetAddress}`
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  );

  GaladrielBridge.on(
    "TokensBurned",
    async (
      user: string,
      amount: any,
      targetChain: string,
      targetAddress: string
    ) => {
      console.log(
        `TokensBurned detected: ${ethers.formatEther(
          amount
        )} tokens burned by ${user} on Galadriel for ${targetChain}`
      );

      if (targetChain === "Sepolia") {
        // Request to unlock equivalent tokens on SepoliaBridge
        const tx = await (SepoliaBridge as any).requestUnlock(
          targetAddress,
          amount
        );
        await tx.wait();
        console.log(
          `Requested unlock of ${ethers.formatEther(
            amount
          )} tokens on Sepolia for ${targetAddress}`
        );
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
