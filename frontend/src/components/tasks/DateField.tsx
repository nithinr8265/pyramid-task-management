"use client";

import { CalendarDays } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";

function fmt(date?: string) {
  if (!date) return "Set date";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DateField({
  value,
  onChange,
  placeholder = "Set date",
  align = "start",
}: {
  value?: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  align?: "start" | "end";
}) {
  return (
    <Popover align={align}
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className={`inline-flex items-center gap-1.5 text-sm hover:opacity-80 ${
            value ? "text-text font-medium" : "text-text-subtle"
          }`}
        >
          <CalendarDays size={13} />
          {value ? fmt(value) : placeholder}
        </button>
      )}
    >
      {(close) => (
        <div className="rounded-lg border border-border bg-surface shadow-lg p-3">
          <Calendar
            selected={value}
            onSelect={(iso) => {
              onChange(iso);
              close();
            }}
          />
        </div>
      )}
    </Popover>
  );
}
