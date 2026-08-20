"use client";

import { DragEvent, useState } from "react";
import { GripVertical, Plus } from "lucide-react";
import { FieldKey, StatusId, Task } from "@/types";
import { TaskCard } from "@/components/tasks/TaskCard";

const STATUS_DOT: Record<StatusId, string> = {
  todo: "bg-slate-400",
  doing: "bg-blue-500",
  completed: "bg-emerald-500",
  "on-hold": "bg-amber-500",
};

export function TaskColumn({
  statusId,
  title,
  tasks,
  fields,
  onAddTask,
  onDeleteTask,
  onMoveTask,
  draggedTaskId,
  onDragStart,
  onDragEnd,
}: {
  statusId: StatusId;
  title: string;
  tasks: Task[];
  fields: Set<FieldKey>;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: StatusId) => void;
  draggedTaskId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const [isDropTarget, setIsDropTarget] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDropTarget(false);
    const taskId =
      draggedTaskId ||
      event.dataTransfer.getData("application/x-pyramid-task-id") ||
      event.dataTransfer.getData("text/plain");
    if (taskId) onMoveTask(taskId, statusId);
  }

  return (
    <div className="w-[280px] shrink-0 flex flex-col">
      <div className="flex items-center gap-1.5 px-1 pb-2">
        <GripVertical size={13} className="text-text-subtle" />
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[statusId]}`} />
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-text-subtle">{tasks.length}</span>
        <button
          onClick={onAddTask}
          aria-label={`Add task to ${title}`}
          className="ml-auto p-1 rounded-md hover:bg-surface-hover text-text-subtle"
        >
          <Plus size={14} />
        </button>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setIsDropTarget(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setIsDropTarget(false);
        }}
        onDrop={handleDrop}
        className={`flex min-h-20 flex-col gap-2 rounded-xl transition-colors ${
          isDropTarget ? "bg-accent-soft ring-1 ring-accent" : ""
        }`}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            fields={fields}
            onDelete={() => onDeleteTask(task.id)}
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={() => {
              setIsDropTarget(false);
              onDragEnd();
            }}
          />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center">
            <p className="text-xs text-text-subtle">No tasks yet</p>
          </div>
        )}

        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm text-text-subtle hover:text-text-muted hover:bg-surface-hover transition-colors"
        >
          <Plus size={14} />
          Add Task
        </button>
      </div>
    </div>
  );
}
