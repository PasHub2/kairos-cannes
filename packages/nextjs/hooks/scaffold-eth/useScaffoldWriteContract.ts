import { useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useSelectedNetwork } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { AllowedChainIds } from "~~/utils/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

/**
 * Wrapper hook for wagmi's useWriteContract hook which loads in deployed contract abi and address automatically
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 * @param config.chainId - chainId that is configured with the scaffold project to make use for multi-chain interactions.
 */
export const useScaffoldWriteContract = <TContractName extends ContractName>({
  contractName,
  functionName,
  args,
  value,
  chainId,
}: {
  contractName: TContractName;
  functionName: string;
  args?: any[];
  value?: string;
  chainId?: AllowedChainIds;
}) => {
  const selectedNetwork = useSelectedNetwork(chainId);
  const { data: deployedContractData } = useDeployedContractInfo({
    contractName,
    chainId: selectedNetwork?.id as AllowedChainIds,
  });

  const { writeContractAsync, isError, isSuccess, isPending, data, error } = useWriteContract();

  const writeContract = async () => {
    if (!deployedContractData) {
      notification.error("Contract not found!");
      return;
    }
    if (!functionName) {
      notification.error("Function name not provided!");
      return;
    }

    try {
      await writeContractAsync({
        chainId: selectedNetwork?.id,
        address: deployedContractData.address,
        abi: deployedContractData.abi as Contract<TContractName>["abi"],
        functionName,
        args,
        value: value ? value : undefined,
      } as any);
    } catch (error: any) {
      notification.error(error.message);
    }
  };

  return {
    writeContractAsync: writeContract,
    isError,
    isSuccess,
    isPending,
    data,
    error,
  };
};
