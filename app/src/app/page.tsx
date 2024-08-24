"use client";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useChainId } from "wagmi";
import { chain } from "@/app/utils/constants";
import { useSwitchChain } from "wagmi";
import { getConfig } from "@/wagmi";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, status } = useSwitchChain();
  const [wrongChain, setWrongChain] = useState(false);
  useEffect(() => {
    if (status === "success") window.location.reload();
  }, [status]);
  useEffect(() => {
    if (chainId != Number(chain)) {
      const config = getConfig();
      const compatibleChainName = config.chains.find(
        (chain1) => chain1.id == Number(chain)
      )?.name;
      toast.error(`Please switch to ${compatibleChainName} to use this app`);
      setWrongChain(true);
    }
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-4 mt-20">
        {isConnected && !wrongChain ? (
          <></>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-xl font-bold text-center"></h1>
            {wrongChain ? (
              <button
                onClick={() => {
                  // @ts-ignore: Ignore chainId type error
                  switchChain({ chainId: Number(chain) });
                }}
                className="btn btn-primary"
              >
                Switch chain
              </button>
            ) : (
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            )}
          </div>
        )}{" "}
      </div>
      <ToastContainer draggable position="top-center" />
    </div>
  );
}

export default App;
