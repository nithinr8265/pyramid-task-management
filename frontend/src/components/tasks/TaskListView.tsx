"use client";

import { DragEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { FieldKey, StatusId, Task } from "@/types";
import { getLabelById, statuses } from "@/data/labels";
import { getMemberById } from "@/data/members";
import { AvatarStack } from "@/components/ui/Avatar";
import { PriorityLabel } from "@/components/tasks/priority";
import { DueDateChip, LabelChip } from "@/components/tasks/chips";
import { RowActionsMenu } from "@/components/ui/RowActionsMenu";

function fmtDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TaskListView({
  tasks,
  fields,
  onAddTask,
  onDeleteTask,
  onMoveTask,
}: {
  tasks: Task[];
  fields: Set<FieldKey>;
  onAddTask: (status: StatusId) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask?: (id: string, status: StatusId) => void;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<StatusId>>(
    new Set()
  );
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<StatusId | null>(null);
  const router = useRouter();

  function toggleGroup(id: StatusId) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDrop(statusId: StatusId, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDropTargetStatus(null);
    const taskId =
      draggedTaskId ||
      event.dataTransfer.getData("application/x-pyramid-task-id") ||
      event.dataTransfer.getData("text/plain");
    setDraggedTaskId(null);
    if (taskId && onMoveTask) {
      onMoveTask(taskId, statusId);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 pb-8">
      <div className="flex flex-col gap-6">
        {statuses.map((status) => {
          const groupTasks = tasks.filter((t) => t.status === status.id);
          const isCollapsed = collapsedGroups.has(status.id);
          const isDropTarget = dropTargetStatus === status.id;

          return (
            <div key={status.id}>
              <button
                onClick={() => toggleGroup(status.id)}
                className="flex items-center gap-1.5 mb-2 text-sm font-medium"
              >
                <ChevronDown
                  size={14}
                  className={`text-text-subtle transition-transform ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
                {status.name}
                <span className="text-text-subtle font-normal">
                  {groupTasks.length}
                </span>
              </button>

              {!isCollapsed && (
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDropTargetStatus(status.id);
                  }}
                  onDragLeave={(event) => {
                    if (event.currentTarget === event.target) {
                      setDropTargetStatus(null);
                    }
                  }}
                  onDrop={(event) => handleDrop(status.id, event)}
                  className={`rounded-xl border transition-colors overflow-x-auto ${
                    isDropTarget
                      ? "border-accent bg-accent-soft ring-1 ring-accent"
                      : "border-border"
                  }`}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-muted text-text-muted text-xs">
                        <th className="text-left font-medium px-3 py-2">Task</th>
                        {fields.has("priority") && (
                          <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">
                            Priority
                          </th>
                        )}
                        {fields.has("members") && (
                          <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">
                            Members
                          </th>
                        )}
                        {fields.has("dueDate") && (
                          <th className="text-left font-medium px-3 py-2 hidden md:table-cell">
                            Due Date
                          </th>
                        )}
                        <th className="text-right font-medium px-3 py-2">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupTasks.map((task) => (
                        <tr
                          key={task.id}
                          draggable
                          onDragStart={(event: DragEvent<HTMLTableRowElement>) => {
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData(
                              "application/x-pyramid-task-id",
                              task.id
                            );
                            event.dataTransfer.setData("text/plain", task.id);
                            setDraggedTaskId(task.id);
                          }}
                          onDragEnd={() => {
                            setDraggedTaskId(null);
                            setDropTargetStatus(null);
                          }}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                          className="border-t border-border hover:bg-surface-hover cursor-grab active:cursor-grabbing transition-colors"
                        >
                          <td className="px-3 py-2.5 font-medium">
                            <div className="flex flex-col gap-1.5">
                              <span className="leading-snug">{task.title}</span>
                              <div className="flex sm:hidden items-center gap-1.5 flex-wrap font-normal">
                                {fields.has("priority") && (
                                  <PriorityLabel priority={task.priority} />
                                )}
                                {fields.has("labels") &&
                                  task.labelIds.slice(0, 2).map((id) => {
                                    const label = getLabelById(id);
                                    return label ? (
                                      <LabelChip key={id} name={label.name} />
                                    ) : null;
                                  })}
                                {fields.has("dueDate") && task.dueDate && (
                                  <DueDateChip date={task.dueDate} />
                                )}
                                {fields.has("members") &&
                                  task.memberIds.length > 0 && (
                                    <AvatarStack
                                      members={task.memberIds.map(getMemberById)}
                                      size="xs"
                                    />
                                  )}
                              </div>
                            </div>
                          </td>
                          {fields.has("priority") && (
                            <td className="px-3 py-2.5 hidden sm:table-cell">
                              <PriorityLabel priority={task.priority} />
                            </td>
                          )}
                          {fields.has("members") && (
                            <td className="px-3 py-2.5 hidden sm:table-cell">
                              <AvatarStack
                                members={task.memberIds.map(getMemberById)}
                                size="xs"
                              />
                            </td>
                          )}
                          {fields.has("dueDate") && (
                            <td className="px-3 py-2.5 hidden md:table-cell text-text-muted">
                              {fmtDate(task.dueDate)}
                            </td>
                          )}
                          <td
                            className="px-3 py-2.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <RowActionsMenu
                              onDelete={() => onDeleteTask(task.id)}
                            />
                          </td>
                        </tr>
                      ))}

                      {groupTasks.length === 0 && (
                        <tr className="border-t border-border">
                          <td
                            colSpan={5}
                            className="px-3 py-4 text-center text-xs text-text-subtle"
                          >
                            No tasks in this section. Drag a task here or add one below.
                          </td>
                        </tr>
                      )}

                      <tr className="border-t border-border">
                        <td colSpan={5} className="px-3 py-2">
                          <button
                            onClick={() => onAddTask(status.id)}
                            className="flex items-center gap-1.5 text-sm text-text-subtle hover:text-text-muted"
                          >
                            <Plus size={14} />
                            Add Task
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
