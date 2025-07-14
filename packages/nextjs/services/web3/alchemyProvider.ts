// import { sepolia } from "viem/chains"; // Removed unused import

// Temporäre Lösung: Wir verwenden einen Standard-Provider für Sepolia
// Der Alchemy Account Abstraction Provider wird später implementiert
export const provider = {
  // Placeholder für den Alchemy Provider
  // TODO: Implementiere Alchemy AA Provider nach SDK-Update
  withSigner: (signer: any) => signer,
  getAddress: async () => "0x0000000000000000000000000000000000000000",
};
