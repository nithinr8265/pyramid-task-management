"use client";

import { Table2 } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";

export type ProjectFieldKey = "priority" | "lead" | "dueDate";

const OPTIONS: { key: ProjectFieldKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "lead", label: "Lead" },
  { key: "dueDate", label: "Due Date" },
];

export function ProjectFieldsMenu({
  fields,
  onToggle,
}: {
  fields: Set<ProjectFieldKey>;
  onToggle: (key: ProjectFieldKey) => void;
}) {
  return (
    <Popover
      align="end"
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="h-9 px-3 flex items-center gap-1.5 rounded-lg border border-border-strong hover:bg-surface-hover text-sm font-medium"
        >
          <Table2 size={14} className="text-text-muted" />
          Fields
        </button>
      )}
    >
      {() => (
        <div className="w-44 rounded-xl border border-border bg-surface shadow-lg p-1.5">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => onToggle(o.key)}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
            >
              <Checkbox checked={fields.has(o.key)} onChange={() => onToggle(o.key)} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
