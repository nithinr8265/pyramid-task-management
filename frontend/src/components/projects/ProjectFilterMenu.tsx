"use client";

import { useState } from "react";
import { ChevronRight, SlidersHorizontal, Users } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { PriorityLabel, PRIORITY_ORDER } from "@/components/tasks/priority";
import { members } from "@/data/members";
import { Priority } from "@/types";

export interface ProjectFilters {
  priority: Set<Priority>;
  leadIds: Set<string>;
}

export function emptyProjectFilters(): ProjectFilters {
  return { priority: new Set(), leadIds: new Set() };
}

export function countActive(f: ProjectFilters) {
  return f.priority.size + f.leadIds.size;
}

function Category({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
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

export function ProjectFilterMenu({
  filters,
  onChange,
}: {
  filters: ProjectFilters;
  onChange: (f: ProjectFilters) => void;
}) {
  function toggleSet<T>(set: Set<T>, value: T) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }
  const active = countActive(filters);

  return (
    <Popover
      align="end"
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          aria-label="Filter"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border-strong hover:bg-surface-hover text-text-muted"
        >
          <SlidersHorizontal size={15} />
          {active > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-medium flex items-center justify-center">
              {active}
            </span>
          )}
        </button>
      )}
    >
      {() => (
        <div className="w-56 rounded-xl border border-border bg-surface shadow-lg p-1.5">
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
          <Category icon={<Users size={15} />} label="Lead">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() =>
                  onChange({ ...filters, leadIds: toggleSet(filters.leadIds, m.id) })
                }
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={filters.leadIds.has(m.id)} onChange={() => {}} />
                {m.name}
              </button>
            ))}
          </Category>
          {active > 0 && (
            <>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => onChange(emptyProjectFilters())}
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
