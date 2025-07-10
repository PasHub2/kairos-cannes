import { ethers } from "hardhat";

async function main() {
  // The address to charge
  const targetAddress = "0xE75F82674E414F05fd9f7e96482D53Ba6D93eDaA";
  
  // Amount of ETH to send (in ETH, not wei)
  const amountToSend = "10.0"; // 10 ETH
  
  // Get the signer (first account from Hardhat)
  const [signer] = await ethers.getSigners();
  
  console.log("Charging wallet address:", targetAddress);
  console.log("From account:", await signer.getAddress());
  console.log("Amount to send:", amountToSend, "ETH");
  
  // Convert ETH to wei
  const amountInWei = ethers.parseEther(amountToSend);
  
  // Send the transaction
  const tx = await signer.sendTransaction({
    to: targetAddress,
    value: amountInWei,
  });
  
  console.log("Transaction hash:", tx.hash);
  
  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt?.blockNumber);
  
  // Check the balance of the target address
  const balance = await ethers.provider.getBalance(targetAddress);
  console.log("New balance of target address:", ethers.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 