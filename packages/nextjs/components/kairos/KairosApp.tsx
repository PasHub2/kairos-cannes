"use client";

import { useState } from "react";
import { LoginButton } from "~~/components/auth/LoginButton";

type Step = "nickname" | "capture" | "preview";

export const KairosApp = () => {
  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

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

  if (step === "capture") {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Hi, {nickname}!</h2>
        <p className="mb-6">Ready to capture your Kairos moment?</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            setPhoto("https://i.imgur.com/gBFyU5E.png"); // Platzhalter-Bild
            setStep("preview");
          }}
        >
          Take Picture
        </button>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Your Moment</h2>
        {photo && <img src={photo} alt="Captured moment" className="rounded-lg shadow-lg mb-6 max-w-sm w-full" />}
        <p className="mb-6">Create an account to save this moment on-chain, forever.</p>
        <div className="flex space-x-4">
          <button className="btn btn-ghost" onClick={() => setStep("capture")}>
            Retake
          </button>
          <LoginButton />
        </div>
      </div>
    );
  }

  return null;
};
