"use client";

import React, { useEffect, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { hardhat } from "viem/chains";
// Import hardhat chain definition
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PrivyProvider
      appId="cmcowytwq00abky0l4dipi8bh" // Make sure this is your correct App ID
      config={{
        // THE FIX IS HERE:
        defaultChain: hardhat, // Tell Privy to use the local hardhat network
        supportedChains: [hardhat], // Specify which chains are supported
        // END OF FIX

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
        {mounted && <ScaffoldEthApp>{children}</ScaffoldEthApp>}
      </QueryClientProvider>
    </PrivyProvider>
  );
};
