// packages/nextjs/components/kairos/IpfsUploader.tsx
"use client";

import { ChangeEvent, useState } from "react";
import { notification } from "~~/utils/scaffold-eth";

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

// packages/nextjs/components/kairos/IpfsUploader.tsx

interface UploaderProps {
  onUploadComplete: (cid: string) => void;
}

export const IpfsUploader = ({ onUploadComplete }: UploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    return <p className="text-error mt-4">Pinata API Key (JWT) not configured.</p>;
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setIsUploading(true);
    notification.info("Uploading image to IPFS via Pinata...");

    try {
      const formData = new FormData();
      formData.append("file", file);

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
      notification.success("Upload successful!");
      onUploadComplete(data.IpfsHash);
    } catch (error) {
      console.error("Upload failed:", error);
      // TECHNICAL FIX: Handle 'unknown' error type
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      notification.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label htmlFor="file-upload" className={`btn btn-primary ${isUploading ? "loading" : ""}`}>
        {isUploading ? "Uploading..." : "Choose Image"}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
};
