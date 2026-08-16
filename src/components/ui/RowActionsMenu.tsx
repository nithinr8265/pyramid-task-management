"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { Popover } from "@/components/ui/Popover";

export function RowActionsMenu({ onDelete }: { onDelete: () => void }) {
  return (
    <Popover
      align="end"
      trigger={({ toggle }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label="More actions"
          className="p-1 rounded-md hover:bg-surface-hover text-text-subtle"
        >
          <MoreHorizontal size={15} />
        </button>
      )}
    >
      {(close) => (
        <div className="w-36 rounded-lg border border-border bg-surface shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              close();
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-red-500 hover:bg-surface-hover"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}
    </Popover>
  );
}
