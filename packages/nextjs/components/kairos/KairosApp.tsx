"use client";
import { ChangeEvent, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BrowserProvider, Contract } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { notification } from "~~/utils/scaffold-eth"; // Stellen Sie sicher, dass dies richtig importiert ist

type Step = "nickname" | "capture" | "preview" | "saving" | "saved" | "gallery";

interface Moment {
  imagePreview: string;
  note: string;
  timestamp: number;
}

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
  const [moments, setMoments] = useState<Moment[]>([]); // Lokaler Speicher für Momente

  const handleNicknameSubmit = () => {
    if (nickname.trim().length < 2) {
      notification.error("Please choose a name.");
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
    if (!imageFile || !imagePreview) return notification.error("No image file selected.");
    const embeddedWallet = wallets[0];
    if (!authenticated || !embeddedWallet) {
      login();
      return;
    }

    setIsSaving(true);
    setStep("saving");
    notification.info("Saving your moment...");

    try {
      const imageCid = await uploadToPinata(imageFile, imageFile.name);
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

      const ethereumProvider = await embeddedWallet.getEthereumProvider();
      const ethersProvider = new BrowserProvider(ethereumProvider);
      const signer = await ethersProvider.getSigner();

      // Ensure the correct chain ID is used for localhost (31337)
      const kairosContractAddress = deployedContracts[31337].Kairos.address;
      const kairosContractAbi = deployedContracts[31337].Kairos.abi;
      const kairosContract = new Contract(kairosContractAddress, kairosContractAbi, signer);

      const tx = await kairosContract.mintMoment(momentJsonCid, Math.floor(Date.now() / 1000));
      await tx.wait();

      notification.success("Saved forever!");
      setMoments(prev => [...prev, { imagePreview, note, timestamp: Date.now() }]); // Moment zur Galerie hinzufügen
      setStep("saved");
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) errorMessage = error.message;
      notification.error(errorMessage);
      setStep("preview"); // Zurück zur Vorschau, falls Fehler auftritt
    } finally {
      setIsSaving(false);
    }
  };

  const resetState = () => {
    setNote("");
    setImageFile(null);
    setImagePreview(null);
    setFinalCid(null);
    setStep("capture");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-between p-4 text-white">
      <div className="w-full max-w-sm mx-auto flex-grow flex flex-col justify-center">
        {step === "nickname" && (
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-1">Welcome to Kairos</h2>
            <p className="text-gray-400 mb-6">First, choose your name.</p>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
            <button
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-transform transform hover:scale-105"
              onClick={handleNicknameSubmit}
            >
              Continue
            </button>
          </div>
        )}

        {step === "capture" && (
          <div className="text-center animate-fade-in">
            <p className="text-2xl font-light mb-6">
              Hi, <span className="font-bold">{nickname}</span>.
            </p>
            <label
              htmlFor="image-capture"
              className="group cursor-pointer w-48 h-48 rounded-full bg-gray-800 border-4 border-dashed border-gray-600 hover:border-blue-500 flex flex-col items-center justify-center transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-500 group-hover:text-blue-500 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="mt-2 text-lg font-medium text-gray-500 group-hover:text-blue-500 transition-all">
                Capture a Moment
              </span>
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
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl animate-fade-in space-y-4">
            <img src={imagePreview} alt="Your captured moment" className="rounded-lg w-full" />
            <textarea
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition"
              placeholder="Add a few words..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-transform transform hover:scale-105"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Forever"}
            </button>
            <button className="w-full text-center text-gray-400 hover:text-white transition" onClick={() => setStep("capture")}>
              Retake
            </button>
          </div>
        )}

        {step === "saving" && (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <p className="mt-6 text-xl font-medium">Making it permanent...</p>
          </div>
        )}

        {step === "saved" && finalCid && (
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">It&apos;s yours. Forever.</h3>
            <p className="mt-2 text-gray-400">This moment is now a permanent part of your story.</p>
            <a
              href={`https://ipfs.io/ipfs/${finalCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-6 text-blue-400 hover:underline"
            >
              View permanent record
            </a>
            <button
              className="w-full mt-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-lg transition"
              onClick={resetState}
            >
              Capture another
            </button>
          </div>
        )}

        {step === "gallery" && (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Moments</h2>
            {moments.length === 0 ? (
              <p className="text-gray-400 text-center">No moments saved yet. Capture one!</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto"> {/* Anpassung für Scrollbarkeit */}
                {moments.map((moment, index) => (
                  <div key={index} className="relative bg-gray-700 rounded-lg overflow-hidden">
                    <img src={moment.imagePreview} alt={`Moment ${index}`} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                      <p className="text-white text-sm font-medium truncate">{moment.note || 'No note'}</p>
                      <p className="text-gray-300 text-xs">{new Date(moment.timestamp).toLocaleDateString()}</p>
                      {/* Circles Teaser Icon */}
                      <div
                        className="absolute top-2 right-2 p-1 bg-gray-900 rounded-full cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                        onClick={() => notification.info("Circles coming soon!")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H4v-2a3 3 0 00-3-3h12c1.334 0 2.502.59 3.356 1.443zm-7.799-3.999a3 3 0 010-6m-4.685 0a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-xl flex justify-around items-center py-3 px-4 mt-8 shadow-lg">
        <button
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            step !== "gallery" ? "text-blue-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setStep("capture")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs mt-1">Capture</span>
        </button>
        <button
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            step === "gallery" ? "text-blue-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setStep("gallery")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs mt-1">Gallery</span>
        </button>
      </div>
    </main>
  );
}