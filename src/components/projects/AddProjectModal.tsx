"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

export function AddProjectModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Project">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Project name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mobile App Redesign"
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none focus-visible:outline-2"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-sm font-medium text-text-muted hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
          >
            Add Project
          </button>
        </div>
      </form>
    </Modal>
  );
}
