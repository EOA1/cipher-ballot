import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/config/wagmi";

import Index from "./pages/Index";
import CreateVote from "./pages/CreateVote";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check for dark mode
  const isDark = typeof window !== "undefined" && 
    window.document.documentElement.classList.contains("dark");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={isDark ? darkTheme({
            accentColor: "hsl(43 80% 55%)",
            accentColorForeground: "hsl(30 20% 8%)",
            borderRadius: "medium",
          }) : lightTheme({
            accentColor: "hsl(43 96% 56%)",
            accentColorForeground: "hsl(30 15% 12%)",
            borderRadius: "medium",
          })}
        >
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
