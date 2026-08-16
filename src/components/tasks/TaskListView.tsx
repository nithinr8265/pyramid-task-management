"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { FieldKey, StatusId, Task } from "@/types";
import { statuses } from "@/data/labels";
import { getMemberById } from "@/data/members";
import { AvatarStack } from "@/components/ui/Avatar";
import { PriorityLabel } from "@/components/tasks/priority";
import { DueDateChip } from "@/components/tasks/chips";
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
}: {
  tasks: Task[];
  fields: Set<FieldKey>;
  onAddTask: (status: StatusId) => void;
  onDeleteTask: (id: string) => void;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<StatusId>>(
    new Set()
  );
  const router = useRouter();

  function toggleGroup(id: StatusId) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 pb-8">
      <div className="flex flex-col gap-6">
        {statuses.map((status) => {
          const groupTasks = tasks.filter((t) => t.status === status.id);
          const isCollapsed = collapsedGroups.has(status.id);
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
                <div className="rounded-xl border border-border overflow-hidden">
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
                          onClick={() => router.push(`/tasks/${task.id}`)}
                          className="border-t border-border hover:bg-surface-hover cursor-pointer transition-colors"
                        >
                          <td className="px-3 py-2.5 font-medium">
                            {task.title}
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
                              <span className="sm:hidden">
                                <DueDateChip date={task.dueDate} />
                              </span>
                              <span className="hidden sm:inline">
                                {fmtDate(task.dueDate)}
                              </span>
                            </td>
                          )}
                          <td className="px-3 py-2.5 text-right">
                            <RowActionsMenu onDelete={() => onDeleteTask(task.id)} />
                          </td>
                        </tr>
                      ))}
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
