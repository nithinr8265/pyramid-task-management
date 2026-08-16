"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

/**
 * A useState-like hook that mirrors its value into localStorage.
 * Starts from `fallback` on the server / first client render to avoid
 * hydration mismatches, then syncs from localStorage after mount.
 */
export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Sync from localStorage after mount. We intentionally don't read
    // localStorage during the initial render (server has no `window`),
    // so this one-time sync avoids an SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(readStorage(key, fallback));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}
