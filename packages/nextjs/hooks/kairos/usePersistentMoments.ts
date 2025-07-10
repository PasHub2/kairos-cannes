import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

export interface Moment {
  imageCid: string;
  note: string;
  timestamp: number;
}

export function usePersistentMoments(): [Moment[], (value: Moment[]) => void] {
  const { user } = usePrivy();
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    if (user?.wallet?.address) {
      const storageKey = `kairos_moments_${user.wallet.address}`;
      const savedMoments = localStorage.getItem(storageKey);
      if (savedMoments) {
        try {
          setMoments(JSON.parse(savedMoments));
        } catch (e) {
          console.error("Failed to parse moments from localStorage", e);
          setMoments([]);
        }
      }
    } else {
      setMoments([]);
    }
  }, [user?.wallet?.address]);

  const setAndSaveMoments = (newMoments: Moment[]) => {
    setMoments(newMoments);
    if (user?.wallet?.address) {
      const storageKey = `kairos_moments_${user.wallet.address}`;
      localStorage.setItem(storageKey, JSON.stringify(newMoments));
    }
  };

  return [moments, setAndSaveMoments];
}