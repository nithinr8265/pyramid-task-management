"use client";

import { useState } from "react";
import { FieldKey, StatusId, Task } from "@/types";
import { statuses } from "@/data/labels";
import { TaskColumn } from "@/components/tasks/TaskColumn";

export function TaskBoard({
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
  onMoveTask: (id: string, status: StatusId) => void;
}) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-x-auto scrollbar-thin px-4 md:px-6 pb-6">
      <div className="flex gap-4 min-w-max">
        {statuses.map((status) => (
          <TaskColumn
            key={status.id}
            statusId={status.id}
            title={status.name}
            tasks={tasks.filter((t) => t.status === status.id)}
            fields={fields}
            onAddTask={() => onAddTask(status.id)}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            draggedTaskId={draggedTaskId}
            onDragStart={setDraggedTaskId}
            onDragEnd={() => setDraggedTaskId(null)}
          />
        ))}
      </div>
    </div>
  );
}
