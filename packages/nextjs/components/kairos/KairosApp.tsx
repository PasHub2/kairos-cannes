// packages/nextjs/components/kairos/KairosApp.tsx
"use client";

import { ChangeEvent, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { notification } from "~~/utils/scaffold-eth";

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

// packages/nextjs/components/kairos/KairosApp.tsx

type Step = "nickname" | "capture" | "preview" | "saved";

export function KairosApp() {
  const { ready, authenticated, login } = usePrivy();

  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMomentCid, setSavedMomentCid] = useState<string | null>(null);

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
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setStep("preview");
  };

  const uploadToPinata = async (content: File | Blob, fileName: string) => {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!jwt) throw new Error("Pinata API Key (JWT) not configured.");

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

    if (!authenticated) {
      login();
      notification.info("Please log in to save your moment.");
      return;
    }

    setIsSaving(true);
    notification.info("Securing your moment...");

    try {
      const imageCid = await uploadToPinata(imageFile, imageFile.name);
      notification.info("Image secured. Creating note...");

      const momentData = {
        version: "1.0",
        image: `ipfs://${imageCid}`,
        note: note,
        createdAt: new Date().toISOString(),
      };
      const jsonBlob = new Blob([JSON.stringify(momentData)], { type: "application/json" });

      const momentCid = await uploadToPinata(jsonBlob, "moment.json");
      setSavedMomentCid(momentCid);

      notification.success("Your moment is saved.");
      setStep("saved");
    } catch (error) {
      console.error("Failed to save:", error);
      // TECHNICAL FIX: Handle 'unknown' error type
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      notification.error(errorMessage);
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
        <p className="text-sm -mt-2 mb-4">Capture a moment.</p>

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
            <p className="mb-4">Welcome, {nickname}! Ready to capture a moment?</p>
            <label htmlFor="image-capture" className="btn btn-accent w-full">
              Capture Moment
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Your captured moment" className="rounded-lg mb-4 w-full" />
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Add a note to your moment..."
              value={note}
              onChange={e => setNote(e.target.value)}
            ></textarea>
            <button
              className={`btn btn-primary w-full mt-4 ${isSaving ? "loading" : ""}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-ghost btn-sm mt-2" onClick={() => setStep("capture")}>
              Try again
            </button>
          </div>
        )}

        {step === "saved" && savedMomentCid && (
          <div className="w-full">
            <h3 className="text-xl font-bold text-success">Saved!</h3>
            <p className="mt-2">This memory is now permanently yours.</p>
            <p className="text-xs break-all mt-4 opacity-60">Proof of authenticity: {savedMomentCid}</p>
            <button
              className="btn btn-secondary w-full mt-6"
              onClick={() => {
                setNote("");
                setStep("capture");
              }}
            >
              Capture another moment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
