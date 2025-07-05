"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { hardhat as hardhatViemChain } from "viem/chains";

// Wichtige Änderung: hardhat-Chain für die Blockchain-Tunnel-URL anpassen!
// Dies ist die URL von deinem ZWEITEN localtunnel, den du gerade gestartet hast!
const hardhatLocalChain = {
  ...hardhatViemChain,
  rpcUrls: {
    default: {
      http: [`http://127.0.0.1:8545`], // <--- NEUE BLOCKCHAIN-TUNNEL-URL HIER EINGEFÜGT!
    },
    public: {
      http: [`http://127.0.0.1:8545`], // <--- NEUE BLOCKCHAIN-TUNNEL-URL HIER EINGEFÜGT!
    },
  },
};


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId="cmcowytwq00abky0l4dipi8bh" // Deine Privy App ID aus dem Screenshot
      config={{
        defaultChain: hardhatLocalChain,
        supportedChains: [hardhatLocalChain],
        loginMethods: ["email", "google", "passkey", "farcaster", "github", "discord", "linkedin", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#2299dd" />
        <Toaster />
        {children}
      </QueryClientProvider>
    </PrivyProvider>
  );
};