"use client";
import { ChangeEvent, useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BrowserProvider, Contract } from "ethers";
import { usePersistentNickname } from "~~/hooks/kairos/usePersistentNickname";
import { usePersistentMoments, type Moment } from "~~/hooks/kairos/usePersistentMoments";
import deployedContracts from "~~/contracts/deployedContracts";
import { notification } from "~~/utils/scaffold-eth";

type Step = "loading" | "nickname" | "capture" | "preview" | "saving" | "saved" | "gallery";

export function KairosApp() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const [nickname, setNickname] = usePersistentNickname();
  const [moments, setMoments] = usePersistentMoments();

  const [step, setStep] = useState<Step>("loading");
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [finalCid, setFinalCid] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) {
      setStep("loading");
      return;
    }
    if (authenticated) {
      if (nickname) {
        setStep("capture");
      } else {
        setStep("nickname");
      }
    } else {
      setStep("nickname");
    }
  }, [ready, authenticated, nickname]);
  
  const handleNicknameSubmit = () => {
    if (nickname.trim().length < 2) {
      notification.error("Please choose a name.");
      return;
    }
    if (!authenticated) {
        login();
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
      if (!imageCid || typeof imageCid !== 'string' || imageCid.length < 46) {
        throw new Error(`Invalid imageCid received: ${imageCid}`);
      }

      const momentData = {
        name: `Kairos Moment by ${nickname}`,
        description: note,
        image: `ipfs://${imageCid}`,
        attributes: [{ trait_type: "Author", value: nickname }, { trait_type: "Timestamp", value: new Date().getTime() }],
      };
      
      const jsonBlob = new Blob([JSON.stringify(momentData)], { type: "application/json" });
      const momentJsonCid = await uploadToPinata(jsonBlob, "moment.json");
      if (!momentJsonCid) throw new Error("Invalid momentJsonCid received.");
      setFinalCid(momentJsonCid);

      const ethereumProvider = await embeddedWallet.getEthereumProvider();
      const ethersProvider = new BrowserProvider(ethereumProvider);
      const signer = await ethersProvider.getSigner();
      
      const kairosContractAddress = deployedContracts[31337].Kairos.address;
      const kairosContractAbi = deployedContracts[31337].Kairos.abi;
      const kairosContract = new Contract(kairosContractAddress, kairosContractAbi, signer);
      
      const tx = await kairosContract.mintMoment(momentJsonCid, Math.floor(Date.now() / 1000));
      await tx.wait();

      notification.success("Saved forever!");
      const newMoment: Moment = { imageCid: imageCid, note, timestamp: Date.now() };
      const updatedMoments = [...moments, newMoment];
      setMoments(updatedMoments);
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

  const resetState = () => {
    setNote("");
    setImageFile(null);
    setImagePreview(null);
    setFinalCid(null);
    setStep("capture");
  };
  
  const gatewayUrl = "red-cheap-meadowlark-802.mypinata.cloud";
  
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-between p-4 text-white">
      <div className={`w-full max-w-sm mx-auto flex-grow flex flex-col ${step === 'gallery' ? 'justify-start pt-6' : 'justify-center'}`}>
        {step === "nickname" && (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center animate-fade-in">
                <h2 className="text-2xl font-bold mb-1">Welcome to Kairos</h2>
                <p className="text-gray-400 mb-6">First, choose your name.</p>
                <input type="text" placeholder="Your name" className="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition" value={nickname} onChange={e => setNickname(e.target.value)} />
                <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-transform transform hover:scale-105" onClick={handleNicknameSubmit}>Continue</button>
            </div>
        )}

        {/* ========== UI CHANGE 1: CAPTURE SCREEN ========== */}
        {step === "capture" && (
            <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
                <h2 className="text-4xl font-light mb-4">
                    Hi, <span className="font-bold text-white">{nickname}</span>.
                </h2>
                <p className="text-lg text-gray-400 mb-8">Ready to capture a moment?</p>
                <label
                  htmlFor="image-capture"
                  className="group cursor-pointer w-48 h-48 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col items-center justify-center transform hover:scale-105"
                >
                  <svg className="h-20 w-20 text-white opacity-90 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input id="image-capture" type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
            </div>
        )}

        {step === "preview" && imagePreview && (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl animate-fade-in space-y-4">
                <img src={imagePreview} alt="Your captured moment" className="rounded-lg w-full" />
                <textarea className="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition" placeholder="Add a few words..." value={note} onChange={e => setNote(e.target.value)} />
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-transform transform hover:scale-105" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Forever"}</button>
                <button className="w-full text-center text-gray-400 hover:text-white transition" onClick={() => setStep("capture")}>Retake</button>
            </div>
        )}
        {step === "saving" && (
            <div className="text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                <p className="mt-6 text-xl font-medium">Making it permanent...</p>
            </div>
        )}

        {/* ========== UI CHANGE 2: SAVED SCREEN ========== */}
        {step === "saved" && finalCid && (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold">It&apos;s yours. Forever.</h3>
                <p className="mt-2 text-gray-400">This moment is now a permanent part of your story.</p>
                <button className="w-full mt-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-lg transition" onClick={resetState}>Capture another</button>
            </div>
        )}

        {step === "gallery" && (
            <div className="bg-gray-800 rounded-2xl shadow-xl animate-fade-in flex flex-col w-full h-full">
                <h2 className="text-2xl font-bold p-6 pb-4 text-center flex-shrink-0">Your Moments</h2>
                {moments.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-400">No moments saved yet. Capture one!</p>
                    </div>
                ) : (
                    <div className="flex-grow p-6 pt-2 overflow-y-auto">
                        {moments.map((moment, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg h-fit">
                                <img src={`https://${gatewayUrl}/ipfs/${moment.imageCid}`} alt={`Moment ${index}`} className="w-full h-32 object-cover" />

                          
                                <div className="p-3">
                                    <p className="text-white text-sm font-medium truncate" title={moment.note || 'No note'}>{moment.note || 'No note'}</p>
                                    <p className="text-gray-400 text-xs mt-1">{new Date(moment.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-xl flex justify-around items-center py-3 px-4 mt-8 shadow-lg">
          <button className={`flex flex-col items-center p-2 rounded-lg transition-colors ${step !== "gallery" ? "text-blue-500" : "text-gray-400 hover:text-white"}`} onClick={resetState}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span className="text-xs mt-1">Capture</span></button>
          <button className={`flex flex-col items-center p-2 rounded-lg transition-colors ${step === "gallery" ? "text-blue-500" : "text-gray-400 hover:text-white"}`} onClick={() => setStep("gallery")}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg><span className="text-xs mt-1">Gallery</span></button>
      </div>
    </main>
  );
}