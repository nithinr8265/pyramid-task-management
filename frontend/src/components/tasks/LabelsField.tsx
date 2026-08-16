"use client";

import { Plus, X } from "lucide-react";
import { labels as allLabels, getLabelById } from "@/data/labels";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";

export function LabelsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {value.map((id) => {
        const label = getLabelById(id);
        if (!label) return null;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1 text-xs bg-surface-muted text-text-muted rounded-md px-2 py-1"
          >
            {label.name}
            <button
              onClick={() => toggle(id)}
              aria-label={`Remove ${label.name}`}
              className="hover:text-text"
            >
              <X size={11} />
            </button>
          </span>
        );
      })}
      <Popover
        trigger={({ toggle: openMenu }) => (
          <button
            onClick={openMenu}
            className="inline-flex items-center gap-1 text-xs text-text-subtle hover:text-text-muted border border-dashed border-border rounded-md px-2 py-1"
          >
            <Plus size={11} />
            Label
          </button>
        )}
      >
        {() => (
          <div className="w-48 rounded-lg border border-border bg-surface shadow-lg p-1 max-h-60 overflow-y-auto scrollbar-thin">
            {allLabels.map((l) => (
              <button
                key={l.id}
                onClick={() => toggle(l.id)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
              >
                <Checkbox checked={value.includes(l.id)} onChange={() => toggle(l.id)} />
                {l.name}
              </button>
            ))}
          </div>
        )}
      </Popover>
    </div>
  );
}
