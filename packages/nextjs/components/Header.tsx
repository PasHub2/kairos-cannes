"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

/**
 * A cleaned-up header for the Kairos application.
 * It removes the debug links and wallet UI, focusing on the app's identity and logout functionality.
 */
export const Header = () => {
  // Privy hook for logout functionality
  const { ready, authenticated, logout } = usePrivy();

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      {/* App branding and logo */}
      <div className="navbar-start w-auto lg:w-1/2">
        <Link href="/" passHref className="flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Kairos logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Kairos</span>
            <span className="text-xs">Photo Diary dApp</span>
          </div>
        </Link>
      </div>

      {/* Logout button appears only when a user is logged in */}
      <div className="navbar-end flex-grow mr-4">
        {ready && authenticated && (
          <button className="btn btn-secondary btn-sm" onClick={() => logout()}>
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};