import "~~/styles/globals.css";
import { Inter } from "next/font/google";
// KORREKTUR: Der Name der Komponente muss 'ScaffoldEthAppWithProviders' sein
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kairos App",
  description: "Your permanent digital diary.",
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        {/* Hier verwenden wir den korrigierten Namen */}
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