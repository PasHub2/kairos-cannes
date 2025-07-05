// packages/nextjs/app/layout.tsx
"use client"; // Steht ganz oben und macht diese Komponente zum Client Component

import "~~/styles/globals.css";
import { Inter } from "next/font/google";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { useEffect } from "react"; // <--- Import bleibt, da er gebraucht wird

const inter = Inter({ subsets: ["latin"] });

// METADATA-BLOCK ENTFERNT, da er nicht aus einer Client Component exportiert werden darf
/*
export const metadata = {
  title: "Kairos App",
  description: "Your permanent digital diary.",
};
*/

const ScaffoldEthApp = ({ children }: { children: React. immense.ReactNode }) => {
  // <--- useEffect HOOK BLEIBT, da er die Fehler unterdrückt
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes("React does not recognize the 'isActive' prop on a DOM element.")
      ) {
        return; // Diese spezifische Fehlermeldung unterdrücken
      }
      originalError(...args); // Alle anderen Fehlermeldungen normal loggen
    };
    return () => {
      console.error = originalError; // Beim Unmount wiederherstellen
    };
  }, []);
  // <--- ENDE DES useEffect HOOKS


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <ScaffoldEthAppWithProviders>
          <div className="flex flex-col min-h-screen">
            <main className="relative flex flex-col flex-1">{children}</main>
          </div>
        </ScaffoldEthAppWithProviders>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;