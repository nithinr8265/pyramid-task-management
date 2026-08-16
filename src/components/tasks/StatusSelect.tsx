"use client";

import { Check, ChevronDown } from "lucide-react";
import { StatusId } from "@/types";
import { statuses } from "@/data/labels";
import { Popover } from "@/components/ui/Popover";

const STATUS_DOT: Record<StatusId, string> = {
  todo: "bg-slate-400",
  doing: "bg-blue-500",
  completed: "bg-emerald-500",
  "on-hold": "bg-amber-500",
};

export function StatusSelect({
  value,
  onChange,
}: {
  value: StatusId;
  onChange: (s: StatusId) => void;
}) {
  const current = statuses.find((s) => s.id === value);
  return (
    <Popover
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80"
        >
          <span className={`w-2 h-2 rounded-full ${STATUS_DOT[value]}`} />
          {current?.name}
          <ChevronDown size={13} className="text-text-subtle" />
        </button>
      )}
    >
      {(close) => (
        <div className="w-40 rounded-lg border border-border bg-surface shadow-lg p-1">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onChange(s.id);
                close();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
            >
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s.id]}`} />
              {s.name}
              {value === s.id && <Check size={13} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
