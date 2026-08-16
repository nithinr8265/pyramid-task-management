import { CalendarDays, Tag } from "lucide-react";

export function LabelChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-text-muted bg-surface-muted rounded-md px-1.5 py-0.5">
      <Tag size={10} />
      {name}
    </span>
  );
}

export function DueDateChip({ date }: { date?: string }) {
  if (!date) return null;
  const d = new Date(date);
  const formatted = d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted">
      <CalendarDays size={11} />
      {formatted}
    </span>
  );
}
