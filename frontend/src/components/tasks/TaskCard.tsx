"use client";

import { useRouter } from "next/navigation";
import { Task, FieldKey } from "@/types";
import { getMemberById } from "@/data/members";
import { getLabelById } from "@/data/labels";
import { AvatarStack } from "@/components/ui/Avatar";
import { DueDateChip, LabelChip } from "@/components/tasks/chips";
import { PriorityBars } from "@/components/tasks/priority";
import { RowActionsMenu } from "@/components/ui/RowActionsMenu";

export function TaskCard({
  task,
  fields,
  onDelete,
}: {
  task: Task;
  fields: Set<FieldKey>;
  onDelete: () => void;
}) {
  const router = useRouter();
  const assignee = getMemberById(task.memberIds[0]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/tasks/${task.id}`)}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          e.target === e.currentTarget
        ) {
          e.preventDefault();
          router.push(`/tasks/${task.id}`);
        }
      }}
      className="w-full text-left rounded-xl border border-border bg-surface p-3 hover:border-border-strong hover:shadow-sm transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <RowActionsMenu onDelete={onDelete} />
      </div>

      {assignee && (
        <p className="mt-2 text-xs text-text-muted">
          Assigned:{" "}
          <span className="text-text font-medium">{assignee.name}</span>
        </p>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {fields.has("priority") && <PriorityBars priority={task.priority} />}
          {fields.has("labels") &&
            task.labelIds.slice(0, 2).map((id) => {
              const label = getLabelById(id);
              return label ? <LabelChip key={id} name={label.name} /> : null;
            })}
        </div>
        {fields.has("dueDate") && <DueDateChip date={task.dueDate} />}
      </div>

      {fields.has("members") && task.memberIds.length > 0 && (
        <div className="mt-2">
          <AvatarStack
            members={task.memberIds.map(getMemberById)}
            size="xs"
          />
        </div>
      )}
    </div>
  );
}
