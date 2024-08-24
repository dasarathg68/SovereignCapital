import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { defineChain } from "viem";

export const galadriel = defineChain({
  id: 696969,
  name: "Galadriel Devnet",
  nativeCurrency: { name: "Galadriel", symbol: "GAL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://devnet.galadriel.com"] },
  },
  blockExplorers: {
    default: {
      name: "Galadriel Explorer",
      url: "https://explorer.galadriel.com",
    },
  },
  contracts: {
    oracle: {
      address: "0x68EC9556830AD097D661Df2557FBCeC166a0A075",
    },
    nonEnclaveOracle: {
      address: "0x0352b37E5680E324E804B5A6e1AddF0A064E201D",
    },
  },
});
export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, galadriel],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: "98ff8584ade069a1bb2f462dcc557865" }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [galadriel.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
