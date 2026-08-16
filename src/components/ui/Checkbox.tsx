import { Check } from "lucide-react";

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
        checked
          ? "bg-accent border-accent text-accent-foreground"
          : "bg-surface border-border-strong"
      }`}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </button>
  );
}
