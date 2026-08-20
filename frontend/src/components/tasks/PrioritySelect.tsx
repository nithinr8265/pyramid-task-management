"use client";

import { Check, ChevronDown } from "lucide-react";
import { Priority } from "@/types";
import { Popover } from "@/components/ui/Popover";
import { PRIORITY_META, PRIORITY_ORDER, PriorityBars } from "@/components/tasks/priority";

export function PrioritySelect({
  value,
  onChange,
  align = "start",
}: {
  value: Priority;
  onChange: (p: Priority) => void;
  align?: "start" | "end";
}) {
  const meta = PRIORITY_META[value];
  return (
    <Popover align={align}
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className={`inline-flex items-center gap-1.5 text-sm font-medium ${meta.colorClass} hover:opacity-80`}
        >
          <PriorityBars priority={value} />
          {meta.label}
          <ChevronDown size={13} className="text-text-subtle" />
        </button>
      )}
    >
      {(close) => (
        <div className="w-44 rounded-lg border border-border bg-surface shadow-lg p-1">
          <p className="px-2 py-1 text-xs text-text-subtle">Priority</p>
          {PRIORITY_ORDER.map((p) => {
            const m = PRIORITY_META[p];
            return (
              <button
                key={p}
                onClick={() => {
                  onChange(p);
                  close();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <PriorityBars priority={p} />
                <span className={m.colorClass}>{m.label}</span>
                {value === p && <Check size={13} className="ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </Popover>
  );
}
