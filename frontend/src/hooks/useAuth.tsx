"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Member } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { api } from "@/lib/api";

export interface Session {
  user: Member;
  provider: "guest" | "google";
  accessToken: string;
}

interface AuthContextValue {
  session: Session | null;
  hydrated: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession, hydrated] = useLocalStorage<Session | null>(
    STORAGE_KEYS.session,
    null
  );

  const loginAsGuest = useCallback(async () => {
    try {
      const data = await api.post<{ accessToken: string; user: Member }>(
        "/auth/guest"
      );
      setSession({
        user: data.user,
        provider: "guest",
        accessToken: data.accessToken,
      });
    } catch (err) {
      console.error("Guest login failed:", err);
      throw err;
    }
  }, [setSession]);

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      try {
        const data = await api.post<{ accessToken: string; user: Member }>(
          "/auth/google",
          { credential }
        );
        setSession({
          user: data.user,
          provider: "google",
          accessToken: data.accessToken,
        });
      } catch (err) {
        console.error("Google login failed:", err);
        throw err;
      }
    },
    [setSession]
  );

  const logout = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const value = useMemo(
    () => ({ session, hydrated, loginAsGuest, loginWithGoogle, logout }),
    [session, hydrated, loginAsGuest, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
