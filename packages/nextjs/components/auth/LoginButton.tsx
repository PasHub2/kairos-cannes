"use client";

import { usePrivy } from "@privy-io/react-auth";

export const LoginButton = () => {
  const { ready, authenticated, login } = usePrivy();

  if (!ready || authenticated) {
    return null;
  }

  return (
    <button onClick={login} className="btn btn-primary">
      Save Forever
    </button>
  );
};
