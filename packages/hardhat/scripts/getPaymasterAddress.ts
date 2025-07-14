import * as dotenv from "dotenv";
dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const POLICY_ID = process.env.ALCHEMY_GAS_MANAGER_POLICY_ID;

if (!ALCHEMY_API_KEY || !POLICY_ID) {
  console.error("Please set ALCHEMY_API_KEY and ALCHEMY_GAS_MANAGER_POLICY_ID in your environment.");
  process.exit(1);
}

const url = `https://gas-manager.g.alchemy.com/policy/${POLICY_ID}`;

(async () => {
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-Alchemy-Token": ALCHEMY_API_KEY,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    if ((result as any).paymasterAddress) {
      console.log("Paymaster Address:", (result as any).paymasterAddress);
    } else {
      console.error("Paymaster address not found in response:", result);
    }
  } catch (err) {
    console.error("Error fetching paymaster address:", err);
  }
})();
