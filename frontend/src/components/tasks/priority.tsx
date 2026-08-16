import { BarChart2 } from "lucide-react";
import { Priority } from "@/types";

export const PRIORITY_META: Record<
  Priority,
  { label: string; colorClass: string; bars: number }
> = {
  urgent: { label: "Urgent", colorClass: "text-red-500", bars: 4 },
  high: { label: "High", colorClass: "text-orange-500", bars: 3 },
  medium: { label: "Medium", colorClass: "text-amber-500", bars: 2 },
  low: { label: "Low", colorClass: "text-text-subtle", bars: 1 },
  "no-priority": { label: "No Priority", colorClass: "text-text-subtle", bars: 0 },
};

export const PRIORITY_ORDER: Priority[] = [
  "no-priority",
  "urgent",
  "high",
  "medium",
  "low",
];

/** Small ascending-bars glyph used next to priority labels, matching the
 * "signal strength" icon shown in the screenshots. */
export function PriorityBars({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  const heights = [4, 7, 10, 13];
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      className={meta.colorClass}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={13 - h}
          width="2.4"
          height={h}
          rx="0.6"
          fill={i < meta.bars ? "currentColor" : "currentColor"}
          opacity={meta.bars === 0 ? 0.35 : i < meta.bars ? 1 : 0.25}
        />
      ))}
    </svg>
  );
}

export function PriorityLabel({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${meta.colorClass}`}>
      <PriorityBars priority={priority} />
      {meta.label}
    </span>
  );
}

export { BarChart2 };
