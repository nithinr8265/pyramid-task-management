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
  onSubmit: (title: string, status: StatusId) => Promise<void> | void;
  defaultStatus?: StatusId;
}) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<StatusId>(defaultStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state during render when defaultStatus changes
  const [prevDefaultStatus, setPrevDefaultStatus] = useState(defaultStatus);
  if (defaultStatus !== prevDefaultStatus) {
    setPrevDefaultStatus(defaultStatus);
    setStatus(defaultStatus);
  }

  function handleClose() {
    setTitle("");
    setStatus(defaultStatus);
    setError(null);
    setLoading(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      await onSubmit(title.trim(), status);
      setTitle("");
      setStatus(defaultStatus);
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div
            role="alert"
            className="p-2.5 rounded-lg text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          >
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Task name
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Write onboarding email"
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none focus-visible:outline-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusId)}
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none disabled:opacity-60"
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
            onClick={handleClose}
            disabled={loading}
            className="h-9 px-4 rounded-lg text-sm font-medium text-text-muted hover:bg-surface-hover disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
