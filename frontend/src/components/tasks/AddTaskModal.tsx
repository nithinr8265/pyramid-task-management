"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Priority, StatusId } from "@/types";
import { labels, statuses } from "@/data/labels";
import { members } from "@/data/members";

export interface AddTaskInput {
  title: string;
  status: StatusId;
  priority?: Priority;
  description?: string;
  dueDate?: string;
  memberIds?: string[];
  labelIds?: string[];
}

export function AddTaskModal({
  open,
  onClose,
  onSubmit,
  defaultStatus = "todo",
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: AddTaskInput) => Promise<unknown> | void;
  defaultStatus?: StatusId;
}) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<StatusId>(defaultStatus);
  const [priority, setPriority] = useState<Priority>("no-priority");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state during render when defaultStatus changes
  const [prevDefaultStatus, setPrevDefaultStatus] = useState(defaultStatus);
  if (defaultStatus !== prevDefaultStatus) {
    setPrevDefaultStatus(defaultStatus);
    setStatus(defaultStatus);
  }

  function resetForm() {
    setTitle("");
    setStatus(defaultStatus);
    setPriority("no-priority");
    setDescription("");
    setDueDate("");
    setMemberIds([]);
    setLabelIds([]);
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        status,
        priority: priority === "no-priority" ? undefined : priority,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        memberIds: memberIds.length ? memberIds : undefined,
        labelIds: labelIds.length ? labelIds : undefined,
      });
      resetForm();
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
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
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
            required
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
            required
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
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none disabled:opacity-60"
          >
            <option value="no-priority">No priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            disabled={loading}
            rows={3}
            className="w-full resize-none px-3 py-2 rounded-lg border border-border-strong bg-surface text-sm outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Due date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none disabled:opacity-60"
          />
        </div>
        <fieldset>
          <legend className="block text-xs font-medium text-text-muted mb-1.5">
            Members
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {members.map((member) => (
              <label key={member.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={memberIds.includes(member.id)}
                  onChange={() =>
                    setMemberIds((ids) =>
                      ids.includes(member.id)
                        ? ids.filter((id) => id !== member.id)
                        : [...ids, member.id]
                    )
                  }
                  disabled={loading}
                  className="accent-[var(--accent)]"
                />
                {member.name}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="block text-xs font-medium text-text-muted mb-1.5">
            Labels
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {labels.map((label) => (
              <label key={label.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={labelIds.includes(label.id)}
                  onChange={() =>
                    setLabelIds((ids) =>
                      ids.includes(label.id)
                        ? ids.filter((id) => id !== label.id)
                        : [...ids, label.id]
                    )
                  }
                  disabled={loading}
                  className="accent-[var(--accent)]"
                />
                {label.name}
              </label>
            ))}
          </div>
        </fieldset>
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
