"use client";

import { ReactNode, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export function Popover({
  trigger,
  children,
  align = "start",
  className = "",
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative inline-block" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          role="menu"
          className={`absolute z-40 mt-1.5 max-w-[calc(100vw-1.5rem)] popover-in ${
            align === "end" ? "right-0" : "left-0"
          } ${className}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
