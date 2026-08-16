"use client";

import { LayoutGrid, List as ListIcon } from "lucide-react";
import { FieldKey, ViewMode } from "@/types";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";

const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
];

export function ViewFieldsMenu({
  view,
  onViewChange,
  fields,
  onToggleField,
  trigger,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  fields: Set<FieldKey>;
  onToggleField: (key: FieldKey) => void;
  trigger: (props: { open: boolean; toggle: () => void }) => React.ReactNode;
}) {
  return (
    <Popover trigger={trigger} align="end" className="w-52">
      {() => (
        <div className="rounded-xl border border-border bg-surface shadow-lg p-1.5">
          <div className="flex rounded-lg bg-surface-muted p-0.5 mb-1.5">
            <button
              onClick={() => onViewChange("list")}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-colors ${
                view === "list"
                  ? "bg-surface shadow-sm text-text"
                  : "text-text-muted"
              }`}
            >
              <ListIcon size={13} /> List
            </button>
            <button
              onClick={() => onViewChange("board")}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-colors ${
                view === "board"
                  ? "bg-surface shadow-sm text-text"
                  : "text-text-muted"
              }`}
            >
              <LayoutGrid size={13} /> Board
            </button>
          </div>

          <div className="flex flex-col gap-0.5">
            {FIELD_OPTIONS.map((f) => (
              <button
                key={f.key}
                onClick={() => onToggleField(f.key)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={fields.has(f.key)} onChange={() => onToggleField(f.key)} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Popover>
  );
}
