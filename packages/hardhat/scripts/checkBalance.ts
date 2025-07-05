import { task } from "hardhat/config";

task("check-balance", "Checks the ETH balance of an address")
  .addParam("address", "The address to check")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const balance = await hre.ethers.provider.getBalance(address);
    console.log(`\n✅ Balance of ${address}: ${hre.ethers.formatEther(balance)} ETH\n`);
  });

export default {}; // To make it a module
