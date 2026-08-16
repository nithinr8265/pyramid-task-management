import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center text-text-subtle mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-sm text-text-subtle mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
