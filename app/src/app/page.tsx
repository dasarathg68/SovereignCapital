"use client";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect } from "react";

function App() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {}, []);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-4 mt-20">
        {isConnected ? (
          <></>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-xl font-bold text-center">
              Please connect your wallet to continue
            </h1>
            <ConnectButton />
          </div>
        )}{" "}
      </div>
    </div>
  );
}

export default App;
