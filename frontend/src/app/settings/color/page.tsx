"use client";

import { Check } from "lucide-react";
import { ACCENT_OPTIONS, useTheme } from "@/hooks/useTheme";

export default function ColorSettingsPage() {
  const { accent, setAccent } = useTheme();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Color</h1>
      <p className="text-sm text-text-subtle mb-6">
        Pick an accent color for buttons, links, and selection states.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-lg">
        {ACCENT_OPTIONS.map((opt) => {
          const active = accent === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setAccent(opt.id)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors"
                style={{
                  background: opt.swatch,
                  borderColor: active ? opt.swatch : "transparent",
                  boxShadow: active ? `0 0 0 2px var(--surface), 0 0 0 4px ${opt.swatch}` : undefined,
                }}
              >
                {active && <Check size={16} className="text-white" />}
              </span>
              <span className="text-xs text-text-muted">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
