// import { defineScaffoldConfig } from "~~/utils/scaffold-eth"; // Diese Zeile wird entfernt!

const scaffoldConfig = {
  targetNetworks: [
    {
      id: 31337, // Hardhat Network ID
      name: "localhost",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: [`http://127.0.0.1:8545`], // <--- ZURÜCK AUF LOCALHOST FÜR LAPTOP
        },
        public: {
          http: [`http://127.0.0.1:8545`], // <--- ZURÜCK AUF LOCALHOST FÜR LAPTOP
        },
      },
      blockExplorers: {
        default: {
          name: "Blockscout",
          url: "https://blockscout.com/eth/goerli", // Placeholder, adjust if you have a local block explorer
        },
      },
      contracts: {
        Kairos: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default Hardhat deployed address
        },
      },
    },
  ],
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