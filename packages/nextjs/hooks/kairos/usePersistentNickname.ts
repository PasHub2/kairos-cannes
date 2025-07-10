import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

export function usePersistentNickname(): [string, (value: string) => void] {
  const { user } = usePrivy();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (user?.wallet?.address) {
      const storageKey = `kairos_nickname_${user.wallet.address}`;
      const savedNickname = localStorage.getItem(storageKey);
      if (savedNickname) {
        setNickname(savedNickname);
      }
    } else {
      setNickname("");
    }
  }, [user?.wallet?.address]);

  const setAndSaveNickname = (value: string) => {
    setNickname(value);
    if (user?.wallet?.address) {
      const storageKey = `kairos_nickname_${user.wallet.address}`;
      localStorage.setItem(storageKey, value);
    }
  };

  return [nickname, setAndSaveNickname];
}