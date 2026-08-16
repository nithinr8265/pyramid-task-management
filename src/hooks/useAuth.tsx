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

/**
 * Frontend-only auth. There is no backend: "login" just creates a
 * session object and persists it to localStorage. A real NestJS API
 * can later replace loginAsGuest/loginWithGoogle with real calls
 * without touching any component that consumes useAuth().
 */

const GUEST_USER: Member = {
  id: "guest",
  name: "Guest",
  email: "guest@pyramid.app",
  initials: "G",
  color: "from-zinc-400 to-zinc-600",
};

// Smallest reasonable assumption: since this is frontend-only, "Login
// with Google" signs in a mock account rather than calling real OAuth.
// The screenshots show a signed-in user named "Dexter" throughout the
// rest of the flow, so that's the mock Google identity used here.
const GOOGLE_USER: Member = {
  id: "dexter",
  name: "Dexter",
  email: "dexter@gmail.com",
  initials: "D",
  color: "from-fuchsia-500 to-indigo-500",
};

interface Session {
  user: Member;
  provider: "guest" | "google";
}

interface AuthContextValue {
  session: Session | null;
  hydrated: boolean;
  loginAsGuest: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession, hydrated] = useLocalStorage<Session | null>(
    STORAGE_KEYS.session,
    null
  );

  const loginAsGuest = useCallback(() => {
    setSession({ user: GUEST_USER, provider: "guest" });
  }, [setSession]);

  const loginWithGoogle = useCallback(() => {
    setSession({ user: GOOGLE_USER, provider: "google" });
  }, [setSession]);

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
