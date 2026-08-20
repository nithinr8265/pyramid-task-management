"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-xl modal-in overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md hover:bg-surface-hover text-text-muted"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto scrollbar-thin flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
