import { sepolia } from "viem/chains";

const scaffoldConfig = {
  // Ändern Sie das Zielnetzwerk auf Sepolia, um den Paymaster zu nutzen.
  targetNetworks: [sepolia],
  pollingInterval: 30000,
  onlyLocalBurnerWallet: true,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  showBurnerWallet: false,
  blockExplorerApiKeys: {
    sepolia: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "YourApiKeyHere",
    goerli: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "YourApiKeyHere",
    mainnet: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "YourApiKeyHere",
  },
  // Füge diese Top-Level-Keys hinzu, die von anderen Scaffold-Eth-Dateien erwartet werden könnten
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "YOUR_ALCHEMY_KEY", // <--- HIER DEINEN ALCHEMY API KEY EINFÜGEN!
  etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "YOUR_ETHERSCAN_API_KEY", // <--- HIER DEINEN ETHERSCAN API KEY EINFÜGEN!
};

export default scaffoldConfig;
