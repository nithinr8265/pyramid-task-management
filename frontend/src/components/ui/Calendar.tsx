"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function Calendar({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (isoDate: string) => void;
}) {
  const initial = selected ? new Date(selected) : new Date();
  const [cursor, setCursor] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1)
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedISO = selected;

  return (
    <div className="w-64">
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="p-1 rounded-md hover:bg-surface-hover text-text-muted"
          aria-label="Previous month"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-medium">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="p-1 rounded-md hover:bg-surface-hover text-text-muted"
          aria-label="Next month"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] text-text-subtle mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <span key={idx} />;
          const date = new Date(year, month, day);
          const iso = toISODate(date);
          const isSelected = iso === selectedISO;
          return (
            <button
              type="button"
              key={idx}
              onClick={() => onSelect(iso)}
              className={`h-7 w-7 rounded-full text-xs flex items-center justify-center transition-colors mx-auto ${
                isSelected
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-surface-hover text-text"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
