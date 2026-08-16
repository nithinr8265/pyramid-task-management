"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { StatusId } from "@/types";
import { statuses } from "@/data/labels";

export function AddTaskModal({
  open,
  onClose,
  onSubmit,
  defaultStatus = "todo",
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, status: StatusId) => void;
  defaultStatus?: StatusId;
}) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<StatusId>(defaultStatus);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), status);
    setTitle("");
    setStatus(defaultStatus);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Task name
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Write onboarding email"
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none focus-visible:outline-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusId)}
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
