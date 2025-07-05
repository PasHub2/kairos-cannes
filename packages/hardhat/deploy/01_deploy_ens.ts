import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, execute, get } = hre.deployments;

  // Deploy MockENSRegistry if it doesn't exist
  let ensRegistry;
  try {
    ensRegistry = await get("MockENSRegistry");
  } catch {
    console.log("Deploying MockENSRegistry...");
    ensRegistry = await deploy("MockENSRegistry", {
      from: deployer,
      log: true,
      autoMine: true,
    });
  }

  // Now, deploy our ENSRegistrar contract.
  // The constructor is now simple and only requires the registry's address.
  const registrar = await deploy("ENSRegistrar", {
    from: deployer,
    args: [ensRegistry.address],
    log: true,
    autoMine: true,
  });

  // --- THE FINAL, CRUCIAL FIX ---
  // The deployer account (who owns the root .eth node) calls setSubnodeOwner.
  // This creates the "kairos" node and immediately sets our ENSRegistrar contract
  // as its owner. This grants our contract the permission it needs.

  console.log("Granting ENSRegistrar ownership of the 'kairos.eth' node...");

  await execute(
    "MockENSRegistry",
    { from: deployer, log: true },
    "setSubnodeOwner",
    ethers.namehash("eth"), // The parent node
    ethers.keccak256(ethers.toUtf8Bytes("kairos")), // The label hash for "kairos"
    registrar.address, // The new owner: our registrar contract
  );

  console.log("ENS setup complete. ENSRegistrar is now owner of kairos.eth.");
};

export default func;
func.tags = ["ENSRegistrar", "ENSSetup"];
