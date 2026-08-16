"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AccentColor, ThemeMode } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";

interface ThemeContextValue {
  mode: ThemeMode;
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ACCENT_OPTIONS: { id: AccentColor; label: string; swatch: string }[] = [
  { id: "amber", label: "Amber", swatch: "#d97706" },
  { id: "blue", label: "Blue", swatch: "#2563eb" },
  { id: "pink", label: "Pink", swatch: "#db2777" },
  { id: "rose", label: "Rose", swatch: "#e11d48" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
  { id: "black", label: "Black", swatch: "#18181b" },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeRaw] = useLocalStorage<ThemeMode>(
    STORAGE_KEYS.theme,
    "light"
  );
  const [accent, setAccentRaw] = useLocalStorage<AccentColor>(
    STORAGE_KEYS.accent,
    "black"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  const setMode = useCallback(
    (next: ThemeMode) => setModeRaw(next),
    [setModeRaw]
  );
  const setAccent = useCallback(
    (next: AccentColor) => setAccentRaw(next),
    [setAccentRaw]
  );

  const value = useMemo(
    () => ({ mode, accent, setMode, setAccent }),
    [mode, accent, setMode, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
