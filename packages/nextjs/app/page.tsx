"use client";

import React from "react";
// import type { NextPage } from "next"; // Typ ist nicht notwendig, wenn nicht direkt verwendet
import { KairosApp } from "~~/components/kairos/KairosApp";

// <--- DIES IST DER KORREKTE PFAD!

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* iPhone Container */}
      <div className="w-full max-w-sm mx-auto">
        {/* iPhone Frame */}
        <div className="relative mx-auto bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Status Bar */}
            <div className="h-6 bg-black flex items-center justify-between px-6 text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>

            {/* App Content */}
            <div className="bg-base-100">
              <KairosApp />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 text-white text-sm">
          <p>📱 Mobile App Preview</p>
          <p className="text-gray-400 text-xs">Resize browser to test responsive design</p>
        </div>
      </div>
    </div>
  );
}
