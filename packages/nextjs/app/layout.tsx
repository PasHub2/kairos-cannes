"use client";

import { Inter } from "next/font/google";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-base-100`}>
        {/*
          Korrekte Konfiguration des ThemeProviders, um Hydration-Fehler zu vermeiden.
        */}
        <ThemeProvider attribute="data-theme" defaultTheme="beyou-dark" enableSystem={false}>
          <ScaffoldEthAppWithProviders>
            <div className="flex flex-col min-h-screen">
              <main className="relative flex flex-col flex-1">{children}</main>
            </div>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
