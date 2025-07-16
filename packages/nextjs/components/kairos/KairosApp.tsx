"use client";

import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { type Moment as PersistentMoment, usePersistentMoments } from "~~/hooks/kairos/usePersistentMoments";
import { usePersistentNickname } from "~~/hooks/kairos/usePersistentNickname";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

interface Moment {
  id: string;
  image: string;
  caption: string;
  timestamp: Date;
  user: string;
}

export const KairosApp = () => {
  const { address } = useAccount();
  const [moments, setMoments] = usePersistentMoments();
  const [nickname, setNickname] = usePersistentNickname();
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Smart contract integration temporarily disabled
  // const { writeContractAsync: writeKairosAsync } = useScaffoldWriteContract({
  //   contractName: "Kairos",
  // });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate IPFS upload (replace with actual implementation)
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !caption.trim()) return;

    const newMoment: Moment = {
      id: Date.now().toString(),
      image: selectedImage,
      caption,
      timestamp: new Date(),
      user: nickname || address || "Anonymous",
    };

    // Convert to PersistentMoment format and add to moments
    const persistentMoment: PersistentMoment = {
      imageCid: selectedImage, // Using URL as CID for now
      note: caption,
      timestamp: Date.now(),
    };

    setMoments([...moments, persistentMoment]);

    // Store on blockchain (temporarily disabled)
    // try {
    //   await writeKairosAsync({
    //     functionName: "storeMoment",
    //     args: [caption, selectedImage],
    //   });
    // } catch (error) {
    //   console.error("Failed to store on blockchain:", error);
    // }

    setCaption("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Convert PersistentMoment to display Moment
  const displayMoments: Moment[] = moments.map((moment, index) => ({
    id: index.toString(),
    image: moment.imageCid,
    caption: moment.note,
    timestamp: new Date(moment.timestamp),
    user: nickname || address || "Anonymous",
  }));

  const latestMoment = displayMoments.length > 0 ? displayMoments[displayMoments.length - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* iPhone Frame */}
      <div className="max-w-md mx-auto bg-black rounded-[3rem] p-2 shadow-2xl">
        <div className="bg-gray-900 rounded-[2.5rem] p-6 min-h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kairos
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              {address ? (
                <button className="px-3 py-1 bg-red-600 rounded-full text-sm hover:bg-red-700 transition-colors">
                  Logout
                </button>
              ) : (
                <button className="px-3 py-1 bg-green-600 rounded-full text-sm hover:bg-green-700 transition-colors">
                  Login
                </button>
              )}
            </div>
          </div>

          {!showProfile ? (
            /* Main Feed */
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center mb-4">Your Moments</h2>

              {latestMoment && (
                <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {latestMoment.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300">{latestMoment.user}</span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(latestMoment.timestamp)}</span>
                    </div>

                    <div className="relative mb-3">
                      <img
                        src={latestMoment.image}
                        alt={latestMoment.caption}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </div>

                    <p className="text-white text-sm">{latestMoment.caption}</p>
                  </div>
                </div>
              )}

              {/* Upload Section */}
              <div className="bg-gray-800 rounded-2xl p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">Share a moment</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    ref={fileInputRef}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-gray-400">Choose photo</span>
                  </button>

                  {selectedImage && (
                    <div className="relative">
                      <img src={selectedImage} alt="Selected" className="w-full h-48 object-cover rounded-xl" />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 bg-red-600 rounded-full p-1 hover:bg-red-700"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full p-3 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedImage || !caption.trim() || isUploading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Share Moment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Profile Section */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Profile</h2>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {nickname?.charAt(0).toUpperCase() || address?.charAt(2).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{nickname || "Anonymous"}</h3>
                    <p className="text-sm text-gray-400">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-md font-semibold">Your Moments ({displayMoments.length})</h3>
                {displayMoments.map(moment => (
                  <div key={moment.id} className="bg-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{moment.user.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-300">{moment.user}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(moment.timestamp)}</span>
                      </div>

                      <div className="relative mb-3">
                        <img src={moment.image} alt={moment.caption} className="w-full h-48 object-cover rounded-xl" />
                      </div>

                      <p className="text-white text-sm">{moment.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
