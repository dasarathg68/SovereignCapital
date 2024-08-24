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
      <ConnectButton />
    </div>
  );
}

export default App;
