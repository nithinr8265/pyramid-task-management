// Small wrapper around localStorage that is safe to import from
// components that render on the server. Every read/write no-ops
// (returns the fallback) when `window` isn't available yet.

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can throw in private-browsing / quota-exceeded cases.
    // Swallow it — persistence is a nice-to-have, not a hard requirement.
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  session: "pyramid:session",
  tasks: "pyramid:tasks",
  projects: "pyramid:projects",
  theme: "pyramid:theme-mode",
  accent: "pyramid:accent-color",
  sidebarCollapsed: "pyramid:sidebar-collapsed",
} as const;
