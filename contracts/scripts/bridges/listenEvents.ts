import { ethers } from "ethers";
import BridgeABI from "../../artifacts/contracts/bridges/Bridge.sol/Bridge.json";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const sepoliaBridgeAddress = "0x45b62FDc67a2Fa5B6bbC0fCB27A781580ddF6271";
  const galadrielBridgeAddress = "0x6f7153684c057e6c0b07a3DD32DA95eDCE7Ead8b";

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
    BridgeABI.abi,
    sepoliaProvider
  ).connect(signer);

  const GaladrielBridge = new ethers.Contract(
    galadrielBridgeAddress,
    BridgeABI.abi,
    galadrielProvider
  ).connect(signerGal);
  const galContract = new ethers.Contract(
    galadrielBridgeAddress,
    BridgeABI.abi,
    signerGal
  );
  const sepoliaContract = new ethers.Contract(
    sepoliaBridgeAddress,
    BridgeABI.abi,
    signer
  );
  // await galContract.withdraw(await galContract.tokenBalance());
  // console.log(await galContract.tokenBalance());
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
        console.log("Minting tokens on Galadriel....");
        try {
          const tx = await galContract.mintTokens(user, amount);
          await tx.wait();
          console.log(
            `Minted ${ethers.formatEther(
              amount
            )} tokens on Galadriel for ${user}`
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
