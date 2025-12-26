import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/config/wagmi";
import { useEffect, useState } from "react";
import { FhevmProvider } from "@/contexts/FhevmContext";

import Index from "./pages/Index";
import CreateVote from "./pages/CreateVote";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains("dark"));
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={isDark ? darkTheme({
            accentColor: "#d4a520",
            accentColorForeground: "#1a1a1a",
            borderRadius: "medium",
          }) : lightTheme({
            accentColor: "#eab308",
            accentColorForeground: "#1a1a1a",
            borderRadius: "medium",
          })}
        >
          <FhevmProvider>
            <Toaster richColors position="top-center" />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CreateVote />} />
                <Route path="/votes" element={<Votes />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FhevmProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
