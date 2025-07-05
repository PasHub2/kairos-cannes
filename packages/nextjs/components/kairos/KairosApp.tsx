"use client";

import { ChangeEvent, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BrowserProvider, Contract } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { notification } from "~~/utils/scaffold-eth";

type Step = "nickname" | "capture" | "preview" | "saving" | "saved";

export function KairosApp() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [finalCid, setFinalCid] = useState<string | null>(null);

  const handleNicknameSubmit = () => {
    if (nickname.trim().length < 3) {
      notification.error("Nickname must be at least 3 characters.");
      return;
    }
    setStep("capture");
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setStep("preview");
  };

  const uploadToPinata = async (content: File | Blob, fileName: string) => {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!jwt) throw new Error("Pinata JWT not configured in .env.local");
    const formData = new FormData();
    formData.append("file", content, fileName);
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.reason || `Upload failed: ${response.statusText}`);
    }
    const data: { IpfsHash: string } = await response.json();
    return data.IpfsHash;
  };

  const handleSave = async () => {
    if (!imageFile) return notification.error("No image file selected.");
    const embeddedWallet = wallets[0];
    if (!authenticated || !embeddedWallet) {
      login();
      return;
    }

    setIsSaving(true);
    setStep("saving");
    notification.info("Preparing your moment...");

    try {
      // Step 1: Upload Image to IPFS
      const imageCid = await uploadToPinata(imageFile, imageFile.name);
      notification.info("Image secured. Creating metadata...");

      // Step 2: Create and Upload Metadata JSON to IPFS
      const momentData = {
        name: `Kairos Moment by ${nickname}`,
        description: note,
        image: `ipfs://${imageCid}`,
        attributes: [
          { trait_type: "Author", value: nickname },
          { trait_type: "Timestamp", value: new Date().getTime() },
        ],
      };
      const jsonBlob = new Blob([JSON.stringify(momentData)], { type: "application/json" });
      const momentJsonCid = await uploadToPinata(jsonBlob, "moment.json");
      setFinalCid(momentJsonCid);

      // Step 3: Mint the NFT with the CID of the JSON metadata
      notification.info(`Immortalizing your moment...`);

      const ethereumProvider = await embeddedWallet.getEthereumProvider();
      const ethersProvider = new BrowserProvider(ethereumProvider);
      const signer = await ethersProvider.getSigner();

      // Get contract details from Scaffold-ETH's deployed contracts
      const kairosContractAddress = deployedContracts[31337].Kairos.address;
      const kairosContractAbi = deployedContracts[31337].Kairos.abi;

      const kairosContract = new Contract(kairosContractAddress, kairosContractAbi, signer);

      const tx = await kairosContract.mintMoment(momentJsonCid, Math.floor(Date.now() / 1000));
      await tx.wait();

      notification.success("Your Moment is now immortalized!");
      setStep("saved");
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) errorMessage = error.message;
      notification.error(errorMessage);
      setStep("preview");
    } finally {
      setIsSaving(false);
    }
  };

  if (!ready) {
    return <div className="loading loading-spinner"></div>;
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Kairos</h2>

        {step === "nickname" && (
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text mx-auto">Create your Nickname</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 'aurelius'"
              className="input input-bordered"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
            <button className="btn btn-primary mt-4" onClick={handleNicknameSubmit}>
              Continue
            </button>
          </div>
        )}

        {step === "capture" && (
          <div className="w-full">
            <p className="mb-4">Welcome, {nickname}!</p>
            <label htmlFor="image-capture" className="btn btn-accent w-full">
              Capture a Moment
            </label>
            <input
              id="image-capture"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        )}

        {step === "preview" && imagePreview && (
          <div className="w-full">
            <img src={imagePreview} alt="Your captured moment" className="rounded-lg mb-4 w-full" />
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Add a note..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <button
              className={`btn btn-primary w-full mt-4 ${isSaving ? "loading" : ""}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Immortalizing..." : "Immortalize Moment"}
            </button>
            <button className="btn btn-ghost btn-sm mt-2" onClick={() => setStep("capture")}>
              Try again
            </button>
          </div>
        )}

        {step === "saving" && (
          <div className="w-full">
            <p className="mb-4">Securing your moment on the blockchain...</p>
            <div className="loading loading-lg loading-spinner text-accent"></div>
          </div>
        )}

        {step === "saved" && finalCid && (
          <div className="w-full">
            <h3 className="text-xl font-bold text-success">Immortalized!</h3>
            <p className="mt-2">This Kairos Moment is now permanently yours.</p>
            <a
              href={`https://ipfs.io/ipfs/${finalCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-accent text-xs break-all mt-4"
            >
              View Proof: {finalCid}
            </a>
            <button
              className="btn btn-secondary w-full mt-6"
              onClick={() => {
                setNote("");
                setStep("capture");
              }}
            >
              Capture another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
