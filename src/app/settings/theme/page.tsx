"use client";

import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeSettingsPage() {
  const { mode, setMode } = useTheme();

  const options = [
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "dark" as const, label: "Dark", icon: Moon },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Theme</h1>
      <p className="text-sm text-text-subtle mb-6">
        Choose how Pyramid looks on this device.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = mode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={`relative rounded-2xl border p-5 text-left transition-colors ${
                active
                  ? "border-accent"
                  : "border-border hover:border-border-strong"
              }`}
            >
              {active && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Check size={12} />
                </span>
              )}
              <div
                className={`w-full h-20 rounded-lg mb-3 border border-border ${
                  opt.id === "light" ? "bg-white" : "bg-zinc-900"
                }`}
              />
              <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                <Icon size={14} />
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
