"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { hardhat } from "viem/chains";
import { LoginButton } from "~~/components/auth/LoginButton";
import deployedContracts from "~~/contracts/deployedContracts";
import { notification } from "~~/utils/scaffold-eth";

type Step = "nickname" | "capture" | "preview" | "registered";

export const KairosApp = () => {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSetNickname = useCallback(async () => {
    if (!nickname.trim()) return;

    setIsRegistering(true);
    try {
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === "privy");
      if (!embeddedWallet) throw new Error("User wallet not found!");

      const provider = await embeddedWallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: embeddedWallet.address as `0x${string}`,
        chain: hardhat,
        transport: custom(provider),
      });

      const contractInfo = deployedContracts[31337].YourContract;
      const hash = await walletClient.writeContract({
        address: contractInfo.address,
        abi: contractInfo.abi,
        functionName: "setNickname",
        args: [nickname.trim()],
      });

      notification.success("Nickname transaction sent! " + hash.substring(0, 8));
      setStep("registered");
    } catch (error) {
      console.error("Error registering nickname:", error);
      notification.error("Error registering nickname.");
    } finally {
      setIsRegistering(false);
    }
  }, [wallets, nickname]);

  useEffect(() => {
    if (step === "preview" && authenticated && wallets.length > 0) {
      handleSetNickname();
    }
  }, [step, authenticated, wallets, handleSetNickname]);

  if (!ready) return <span className="loading loading-spinner"></span>;

  if (!authenticated) {
    if (step === "nickname") {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Enter a nickname to start</h2>
          <input
            type="text"
            placeholder="your-nickname"
            className="input input-bordered w-full max-w-xs mb-4"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (nickname.trim()) setStep("capture");
            }}
            disabled={!nickname.trim()}
          >
            Continue
          </button>
        </div>
      );
    }
    if (step === "capture" || step === "preview") {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Your Moment</h2>
          {photo && <img src={photo} alt="Captured moment" className="rounded-lg shadow-lg mb-6 max-w-sm w-full" />}
          <p className="mb-6">Create an account to save this moment on-chain, forever.</p>
          <div className="flex space-x-4">
            <button className="btn btn-ghost" onClick={() => setPhoto("https://i.imgur.com/gBFyU5E.png")}>
              Retake
            </button>
            <LoginButton />
          </div>
        </div>
      );
    }
  }

  // UI für eingeloggte Nutzer
  if (isRegistering) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Registering your name...</h2>
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (step === "registered" || (authenticated && !isRegistering)) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Welcome, {nickname}.kairos.eth!</h2>
        <p>Your on-chain identity is ready.</p>
        <p className="text-xs mt-4">Wallet: {user?.wallet?.address}</p>
      </div>
    );
  }

  return null;
};
