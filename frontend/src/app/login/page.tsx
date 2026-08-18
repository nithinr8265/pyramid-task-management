"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/Logo";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
            }
          ) => void;
          prompt: (momentListener?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
          }) => void) => void;
        };
      };
    };
  }
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.41 3.63v3.02h3.9c2.28-2.1 3.56-5.2 3.56-8.84z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.9-3.02c-1.08.73-2.46 1.16-4.05 1.16-3.12 0-5.76-2.1-6.7-4.93H1.27v3.1C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.4-2.31v-3.1H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.41l4.03-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.03 3.1c.94-2.83 3.58-4.92 6.7-4.92z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { session, hydrated, loginAsGuest, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<"guest" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hiddenGoogleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hydrated && session) {
      router.replace("/tasks");
    }
  }, [hydrated, session, router]);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      if (!response.credential) {
        setError("No credential returned from Google.");
        setPending(null);
        return;
      }
      try {
        setPending("google");
        setError(null);
        await loginWithGoogle(response.credential);
        router.replace("/tasks");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Google authentication failed.";
        setError(message);
        setPending(null);
      }
    },
    [loginWithGoogle, router]
  );

  const initGsi = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (hiddenGoogleButtonRef.current) {
        window.google.accounts.id.renderButton(hiddenGoogleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: 320,
        });
      }
    } catch (e) {
      console.error("Failed to initialize Google Identity Services:", e);
    }
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      initGsi();
    }
  }, [initGsi]);

  async function handleGuest() {
    try {
      setError(null);
      setPending("guest");
      await loginAsGuest();
      router.replace("/tasks");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Guest login failed.";
      setError(message);
      setPending(null);
    }
  }

  function handleGoogle() {
    setError(null);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
      setError(
        "Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend/.env.local."
      );
      return;
    }

    if (!window.google?.accounts?.id) {
      setError("Google Identity Services is loading. Please try again in a moment.");
      return;
    }

    setPending("google");

    const btn = hiddenGoogleButtonRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLElement | null;

    if (btn) {
      btn.click();
    } else {
      window.google.accounts.id.prompt((notification) => {
        if (
          notification.isDismissedMoment() ||
          notification.isSkippedMoment()
        ) {
          setPending(null);
        }
      });
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => initGsi()}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-10 bg-surface">
        <div className="w-full max-w-[390px] flex flex-col items-center">
          <div className="mb-8">
            <Logo />
          </div>

          <div className="w-full rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-center text-text">
              Let&apos;s get back on track
            </h1>
            <p className="mt-2 text-sm text-text-muted text-center">
              Enter your email below to login to your account.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-4 p-3 rounded-lg text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start justify-between gap-2"
              >
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="font-bold hover:opacity-75 text-base leading-none"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleGuest}
                disabled={pending !== null}
                className="w-full h-11 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {pending === "guest" ? "Continuing…" : "Continue as Guest"}
              </button>
              <button
                onClick={handleGoogle}
                disabled={pending !== null}
                className="w-full h-11 rounded-full border border-border-strong bg-surface text-sm font-medium text-text flex items-center justify-center gap-2 hover:bg-surface-hover transition-colors disabled:opacity-60"
              >
                <GoogleIcon />
                {pending === "google" ? "Connecting…" : "Login with Google"}
              </button>

              {/* Hidden Google Identity Services button container */}
              <div
                ref={hiddenGoogleButtonRef}
                className="hidden"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="mt-6 text-xs text-text-subtle text-center leading-relaxed max-w-[280px]">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-text-muted">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-text-muted">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
