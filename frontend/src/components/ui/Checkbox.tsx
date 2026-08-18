import { Check } from "lucide-react";

export function Checkbox({
  checked,
  className = "",
}: {
  checked: boolean;
  onChange?: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
        checked
          ? "bg-accent border-accent text-accent-foreground"
          : "bg-surface border-border-strong"
      } ${className}`}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </span>
  );
}
