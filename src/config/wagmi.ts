import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { sepolia } from "viem/chains";

export const config = getDefaultConfig({
  appName: "CipherVote DAO",
  projectId: "ciphervote-demo", // For demo purposes - replace with WalletConnect project ID for production
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
