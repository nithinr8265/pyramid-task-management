"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Link2,
  Lock,
  MoreHorizontal,
  PanelRight,
  Paperclip,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { getMemberById } from "@/data/members";
import { Avatar } from "@/components/ui/Avatar";
import { PrioritySelect } from "@/components/tasks/PrioritySelect";
import { StatusSelect } from "@/components/tasks/StatusSelect";
import { DateField } from "@/components/tasks/DateField";
import { MembersField } from "@/components/tasks/MembersField";
import { LabelsField } from "@/components/tasks/LabelsField";
import { Popover } from "@/components/ui/Popover";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getTask, updateTask, deleteTask, addComment, addSubtask, toggleSubtask } =
    useTasks();
  const { session } = useAuth();
  const task = getTask(id);

  const [comment, setComment] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-10 text-center">
        <p className="text-sm font-medium">Task not found</p>
        <Link href="/tasks" className="text-sm text-accent underline">
          Back to tasks
        </Link>
      </div>
    );
  }

  const reporter = getMemberById(task.reporterId);

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || !task) return;
    addComment(task.id, comment.trim(), session?.user.id ?? "guest");
    setComment("");
  }

  function submitSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubtask.trim() || !task) return;
    addSubtask(task.id, newSubtask.trim());
    setNewSubtask("");
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-4 md:px-6 h-11 border-b border-border shrink-0">
        <button
          onClick={() => router.back()}
          className="text-sm text-text-muted hover:text-text"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="flex-1 min-w-0 lg:overflow-y-auto lg:scrollbar-thin px-4 md:px-8 py-6">
          <div className="flex items-start justify-between gap-3">
            <input
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              className="text-2xl font-semibold bg-transparent outline-none w-full"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="p-1.5 rounded-md text-text-subtle" title="Private">
                <Lock size={15} />
              </span>
              <span className="flex items-center gap-1 px-1.5 py-1 rounded-md text-text-subtle text-xs">
                <Eye size={14} /> {task.watcherCount ?? 0}
              </span>
              <button
                className="p-1.5 rounded-md hover:bg-surface-hover text-text-subtle"
                title="Copy link"
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
              >
                <Link2 size={15} />
              </button>
              <Popover
                align="end"
                trigger={({ toggle }) => (
                  <button
                    onClick={toggle}
                    className="p-1.5 rounded-md hover:bg-surface-hover text-text-subtle"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                )}
              >
                {(close) => (
                  <div className="w-40 rounded-lg border border-border bg-surface shadow-lg p-1">
                    <button
                      onClick={() => {
                        deleteTask(task.id);
                        close();
                        router.push("/tasks");
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-red-500 hover:bg-surface-hover"
                    >
                      <Trash2 size={13} />
                      Delete task
                    </button>
                  </div>
                )}
              </Popover>
              <button
                onClick={() => setPanelOpen((o) => !o)}
                className="p-1.5 rounded-md hover:bg-surface-hover text-text-subtle"
                title="Toggle details"
              >
                <PanelRight size={15} />
              </button>
            </div>
          </div>

          <textarea
            value={task.description ?? ""}
            onChange={(e) =>
              updateTask(task.id, { description: e.target.value })
            }
            placeholder="Add a description..."
            rows={2}
            className="mt-2 w-full resize-none bg-transparent outline-none text-sm text-text-muted placeholder:text-text-subtle"
          />

          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-4">
              <span className="w-24 text-text-subtle shrink-0">Properties</span>
              <div className="flex items-center gap-4">
                <MembersField
                  value={task.memberIds}
                  onChange={(ids) => updateTask(task.id, { memberIds: ids })}
                />
                <DateField
                  value={task.dueDate}
                  onChange={(iso) => updateTask(task.id, { dueDate: iso })}
                />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-24 text-text-subtle shrink-0 pt-1">Labels</span>
              <LabelsField
                value={task.labelIds}
                onChange={(ids) => updateTask(task.id, { labelIds: ids })}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-text-subtle shrink-0">Resources</span>
              <button className="inline-flex items-center gap-1.5 text-text-subtle hover:text-text-muted">
                <Paperclip size={13} />
                Add document or link...
              </button>
            </div>
          </div>

          {/* Subtasks table */}
          <div className="mt-7">
            <h3 className="text-sm font-medium mb-2">Subtasks</h3>
            {task.subtasks.length > 0 && (
              <div className="rounded-xl border border-border overflow-hidden mb-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-muted text-text-muted text-xs">
                      <th className="text-left font-medium px-3 py-2">Task</th>
                      <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">Priority</th>
                      <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">Members</th>
                      <th className="text-left font-medium px-3 py-2 hidden md:table-cell">Due Date</th>
                      <th className="text-right font-medium px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.subtasks.map((s) => (
                      <tr key={s.id} className="border-t border-border">
                        <td className="px-3 py-2.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={s.done}
                              onChange={() => toggleSubtask(task.id, s.id)}
                              className="accent-[var(--accent)]"
                            />
                            <span className={s.done ? "line-through text-text-subtle" : ""}>
                              {s.title}
                            </span>
                          </label>
                        </td>
                        <td className="px-3 py-2.5 hidden sm:table-cell text-text-muted capitalize">
                          {s.priority.replace("-", " ")}
                        </td>
                        <td className="px-3 py-2.5 hidden sm:table-cell text-text-muted">
                          {s.memberIds.map((id) => getMemberById(id)?.name).join(", ") || "—"}
                        </td>
                        <td className="px-3 py-2.5 hidden md:table-cell text-text-muted">
                          {s.dueDate
                            ? new Date(s.dueDate).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-text-subtle">···</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <form onSubmit={submitSubtask} className="flex items-center gap-2">
              <Plus size={14} className="text-text-subtle" />
              <input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add Subtasks"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-subtle py-1"
              />
            </form>
          </div>

          {/* Comments */}
          <div className="mt-7">
            <h3 className="text-sm font-medium mb-3">Comments</h3>
            <div className="flex flex-col gap-3">
              {task.comments.map((c) => {
                const author = getMemberById(c.authorId);
                return (
                  <div key={c.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar member={author} size="xs" />
                      <span className="text-sm font-medium">{author?.name ?? "Someone"}</span>
                      <span className="text-xs text-text-subtle">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-muted">{c.body}</p>
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={submitComment}
              className="mt-3 flex items-center gap-2 rounded-xl border border-border px-3 py-2"
            >
              <Paperclip size={14} className="text-text-subtle shrink-0" />
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-subtle"
              />
              <button
                type="submit"
                aria-label="Send comment"
                className="text-text-subtle hover:text-accent disabled:opacity-40"
                disabled={!comment.trim()}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Details sidebar */}
        {panelOpen && (
          <aside className="w-full lg:w-[280px] shrink-0 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto scrollbar-thin px-4 py-5">
            <p className="text-xs font-medium text-text-subtle mb-3">Details</p>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-text-subtle">Status</dt>
                <dd>
                  <StatusSelect
                    value={task.status}
                    onChange={(s) => updateTask(task.id, { status: s })}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-subtle">Priority</dt>
                <dd>
                  <PrioritySelect
                    value={task.priority}
                    onChange={(p) => updateTask(task.id, { priority: p })}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-subtle">Members</dt>
                <dd>
                  <MembersField
                    value={task.memberIds}
                    onChange={(ids) => updateTask(task.id, { memberIds: ids })}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-subtle">Due date</dt>
                <dd>
                  <DateField
                    value={task.dueDate}
                    onChange={(iso) => updateTask(task.id, { dueDate: iso })}
                  />
                </dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="text-text-subtle shrink-0">Labels</dt>
                <dd className="flex justify-end">
                  <LabelsField
                    value={task.labelIds}
                    onChange={(ids) => updateTask(task.id, { labelIds: ids })}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-subtle">Reporter</dt>
                <dd className="flex items-center gap-1.5">
                  <Avatar member={reporter} size="xs" />
                  <span>{reporter?.name ?? "Unassigned"}</span>
                </dd>
              </div>
            </dl>

            {task.updates.length > 0 && (
              <>
                <p className="text-xs font-medium text-text-subtle mt-6 mb-2">
                  Updates
                </p>
                <ul className="flex flex-col gap-3">
                  {task.updates.map((u) => {
                    const author = getMemberById(u.authorId);
                    return (
                      <li key={u.id} className="text-xs text-text-muted flex gap-2">
                        <Avatar member={author} size="xs" />
                        <span>
                          <span className="font-medium text-text">
                            {author?.name ?? "Someone"}
                          </span>{" "}
                          {u.message} · {timeAgo(u.createdAt)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
