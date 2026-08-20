"use client";

import { UserPlus } from "lucide-react";
import { members as allMembers, getMemberById } from "@/data/members";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { AvatarStack } from "@/components/ui/Avatar";

export function MembersField({
  value,
  onChange,
  align = "start",
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  align?: "start" | "end";
}) {
  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  }

  return (
    <Popover align={align}
      trigger={({ toggle: openMenu }) => (
        <button
          onClick={openMenu}
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-80"
        >
          {value.length > 0 ? (
            <AvatarStack members={value.map(getMemberById)} size="xs" />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-text-subtle">
              <UserPlus size={13} />
              Add members
            </span>
          )}
        </button>
      )}
    >
      {() => (
        <div className="w-52 rounded-lg border border-border bg-surface shadow-lg p-1 max-h-64 overflow-y-auto scrollbar-thin">
          {allMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-surface-hover"
            >
              <Checkbox checked={value.includes(m.id)} onChange={() => toggle(m.id)} />
              {m.name}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
