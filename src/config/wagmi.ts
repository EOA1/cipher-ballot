import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "CipherVote DAO" }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});
