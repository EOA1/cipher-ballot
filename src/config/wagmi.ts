import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
  rainbowWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";

// WalletConnect project ID - required for mobile wallet connections
const WALLETCONNECT_PROJECT_ID = "3a8170812b534d0ff9d794f19a901d64";

export const config = getDefaultConfig({
  appName: "CipherVote DAO",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [sepolia],
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: "More",
      wallets: [
        trustWallet,
        injectedWallet,
      ],
    },
  ],
});
