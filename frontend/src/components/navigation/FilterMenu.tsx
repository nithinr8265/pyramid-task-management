"use client";

import { ReactNode, useState } from "react";
import { Calendar, ChevronRight, Circle, Tag, Users } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { PriorityLabel, PRIORITY_ORDER } from "@/components/tasks/priority";
import { statuses, labels as allLabels } from "@/data/labels";
import { members } from "@/data/members";
import { Priority, StatusId } from "@/types";

export interface TaskFilters {
  status: Set<StatusId>;
  priority: Set<Priority>;
  memberIds: Set<string>;
  labelIds: Set<string>;
}

export function emptyFilters(): TaskFilters {
  return {
    status: new Set(),
    priority: new Set(),
    memberIds: new Set(),
    labelIds: new Set(),
  };
}

export function countActiveFilters(f: TaskFilters) {
  return f.status.size + f.priority.size + f.memberIds.size + f.labelIds.size;
}

function Category({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm hover:bg-surface-hover"
      >
        <span className="text-text-muted shrink-0">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <ChevronRight
          size={14}
          className={`text-text-subtle transition-transform ${
            open ? "rotate-90 sm:rotate-0" : ""
          }`}
        />
      </button>
      {open && (
        <div className="sm:absolute sm:left-full sm:top-0 sm:ml-1 w-full sm:w-52 max-h-72 overflow-y-auto scrollbar-thin rounded-lg border border-border bg-surface shadow-lg p-1.5 popover-in mt-1 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterMenu({
  filters,
  onChange,
  trigger,
}: {
  filters: TaskFilters;
  onChange: (next: TaskFilters) => void;
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
}) {
  function toggleSet<T>(set: Set<T>, value: T) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  return (
    <Popover trigger={trigger} align="end" className="w-56">
      {() => (
        <div className="rounded-xl border border-border bg-surface shadow-lg p-1.5">
          <Category icon={<Circle size={15} />} label="Status">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  onChange({ ...filters, status: toggleSet(filters.status, s.id) })
                }
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={filters.status.has(s.id)} onChange={() => {}} />
                {s.name}
              </button>
            ))}
          </Category>

          <Category icon={<span className="text-[13px]">▲</span>} label="Priority">
            {PRIORITY_ORDER.map((p) => (
              <button
                key={p}
                onClick={() =>
                  onChange({ ...filters, priority: toggleSet(filters.priority, p) })
                }
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={filters.priority.has(p)} onChange={() => {}} />
                <PriorityLabel priority={p} />
              </button>
            ))}
          </Category>

          <Category icon={<Users size={15} />} label="Members">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() =>
                  onChange({
                    ...filters,
                    memberIds: toggleSet(filters.memberIds, m.id),
                  })
                }
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={filters.memberIds.has(m.id)} onChange={() => {}} />
                {m.name}
              </button>
            ))}
          </Category>

          <Category icon={<Calendar size={15} />} label="Due Date">
            <p className="px-2 py-1.5 text-xs text-text-subtle">
              Sort or filter by due date from the Fields menu.
            </p>
          </Category>

          <Category icon={<Tag size={15} />} label="Labels">
            {allLabels.map((l) => (
              <button
                key={l.id}
                onClick={() =>
                  onChange({
                    ...filters,
                    labelIds: toggleSet(filters.labelIds, l.id),
                  })
                }
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={filters.labelIds.has(l.id)} onChange={() => {}} />
                {l.name}
              </button>
            ))}
          </Category>

          {countActiveFilters(filters) > 0 && (
            <>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => onChange(emptyFilters())}
                className="w-full text-left px-2.5 py-2 rounded-md text-sm text-red-500 hover:bg-surface-hover"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      )}
    </Popover>
  );
}
