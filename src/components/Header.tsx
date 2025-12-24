import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./ThemeToggle";
import { Shield } from "lucide-react";
import logo from "@/assets/logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="CipherVote Logo" 
              className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              CipherVote
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Private voting for DAOs
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/votes"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Active Votes
          </Link>
          <Link
            to="/create"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Create Vote
          </Link>
          <Link
            to="/results"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Results
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Testnet Badge */}
          <div className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:flex">
            <Shield className="h-3 w-3" />
            Sepolia Testnet
          </div>
          
          <ThemeToggle />
          
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                      >
                        <span className="hidden sm:inline">
                          {account.displayName}
                        </span>
                        <span className="sm:hidden">
                          {account.displayName.slice(0, 6)}...
                        </span>
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
