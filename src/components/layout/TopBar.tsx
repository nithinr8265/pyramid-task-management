"use client";

import { ReactNode, useState } from "react";
import { PanelLeft, Plus, Search, SlidersHorizontal, Table2 } from "lucide-react";
import { FieldKey, ViewMode } from "@/types";
import { ViewFieldsMenu } from "@/components/navigation/ViewFieldsMenu";
import { FilterMenu, TaskFilters, countActiveFilters } from "@/components/navigation/FilterMenu";

export function TopBar({
  title,
  breadcrumb,
  onToggleSidebar,
  view,
  onViewChange,
  fields,
  onToggleField,
  filters,
  onFiltersChange,
  search,
  onSearchChange,
  addLabel,
  onAdd,
}: {
  title: string;
  breadcrumb?: ReactNode;
  onToggleSidebar: () => void;
  view?: ViewMode;
  onViewChange?: (v: ViewMode) => void;
  fields?: Set<FieldKey>;
  onToggleField?: (key: FieldKey) => void;
  filters?: TaskFilters;
  onFiltersChange?: (f: TaskFilters) => void;
  search: string;
  onSearchChange: (v: string) => void;
  addLabel: string;
  onAdd: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const activeFilterCount = filters ? countActiveFilters(filters) : 0;

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-2 px-4 md:px-6 h-11">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted"
        >
          <PanelLeft size={16} />
        </button>
        {breadcrumb}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 md:px-6 pb-4 pt-1 flex-wrap">
        <h1 className="text-xl md:text-[22px] font-semibold">{title}</h1>

        <div className="flex items-center gap-2 flex-wrap">
          {searchOpen ? (
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border-strong bg-surface min-w-[160px] sm:min-w-[220px]">
              <Search size={14} className="text-text-subtle shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={() => {
                  if (!search) setSearchOpen(false);
                }}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-subtle min-w-0"
              />
              <kbd className="hidden sm:inline text-[10px] text-text-subtle border border-border rounded px-1 py-0.5">
                ⌘F
              </kbd>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border-strong hover:bg-surface-hover text-text-muted"
            >
              <Search size={15} />
            </button>
          )}

          {view && onViewChange && fields && onToggleField && (
            <ViewFieldsMenu
              view={view}
              onViewChange={onViewChange}
              fields={fields}
              onToggleField={onToggleField}
              trigger={({ toggle }) => (
                <button
                  onClick={toggle}
                  className="h-9 px-3 flex items-center gap-1.5 rounded-lg border border-border-strong hover:bg-surface-hover text-sm font-medium"
                >
                  <Table2 size={14} className="text-text-muted" />
                  Fields
                </button>
              )}
            />
          )}

          {filters && onFiltersChange && (
            <FilterMenu
              filters={filters}
              onChange={onFiltersChange}
              trigger={({ toggle }) => (
                <button
                  onClick={toggle}
                  aria-label="Filter"
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border-strong hover:bg-surface-hover text-text-muted"
                >
                  <SlidersHorizontal size={15} />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-medium flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}
            />
          )}

          <button
            onClick={onAdd}
            className="h-9 px-3.5 flex items-center gap-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">{addLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
