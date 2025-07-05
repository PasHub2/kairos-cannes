import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "Kairos" using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployKairosContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Kairos", {
    from: deployer,
    // Contract constructor arguments (initialOwner)
    args: [deployer],
    log: true,
    autoMine: true,
  });
};

export default deployKairosContract;

deployKairosContract.tags = ["Kairos"];
