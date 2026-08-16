"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderX, PanelLeft, Plus, Search } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getMemberById } from "@/data/members";
import { Avatar } from "@/components/ui/Avatar";
import { PriorityLabel } from "@/components/tasks/priority";
import { RowActionsMenu } from "@/components/ui/RowActionsMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddProjectModal } from "@/components/projects/AddProjectModal";
import {
  ProjectFieldsMenu,
  ProjectFieldKey,
} from "@/components/projects/ProjectFieldsMenu";
import {
  ProjectFilterMenu,
  ProjectFilters,
  emptyProjectFilters,
} from "@/components/projects/ProjectFilterMenu";

function fmtDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectsPage() {
  const { projects, addProject } = useProjects();
  const { setCollapsed } = useSidebarCollapsed();
  const router = useRouter();

  const [fieldList, setFieldList] = useLocalStorage<ProjectFieldKey[]>(
    "pyramid:projects-fields",
    ["priority", "lead", "dueDate"]
  );
  const fields = new Set(fieldList);
  function toggleField(key: ProjectFieldKey) {
    setFieldList((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>(emptyProjectFilters());
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filters.priority.size && !filters.priority.has(p.priority))
        return false;
      if (filters.leadIds.size && !filters.leadIds.has(p.leadId)) return false;
      return true;
    });
  }, [projects, search, filters]);

  return (
    <>
      <div className="border-b border-border">
        <div className="flex items-center gap-2 px-4 md:px-6 h-11">
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted"
          >
            <PanelLeft size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 pb-4 pt-1 flex-wrap">
          <h1 className="text-xl md:text-[22px] font-semibold">Projects</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {searchOpen ? (
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border-strong bg-surface min-w-[160px] sm:min-w-[220px]">
                <Search size={14} className="text-text-subtle shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => !search && setSearchOpen(false)}
                  placeholder="Search projects..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-subtle min-w-0"
                />
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
            <ProjectFieldsMenu fields={fields} onToggle={toggleField} />
            <ProjectFilterMenu filters={filters} onChange={setFilters} />
            <button
              onClick={() => setAddOpen(true)}
              className="h-9 px-3.5 flex items-center gap-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add Project</span>
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderX size={20} />}
          title={search ? "No matching projects" : "No projects yet"}
          description={
            search
              ? `Nothing matches "${search}".`
              : "Create your first project to organize tasks."
          }
        />
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 pb-8">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-muted text-text-muted text-xs">
                  <th className="text-left font-medium px-3 py-2">Projects</th>
                  {fields.has("priority") && (
                    <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">
                      Priority
                    </th>
                  )}
                  {fields.has("lead") && (
                    <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">
                      Lead
                    </th>
                  )}
                  {fields.has("dueDate") && (
                    <th className="text-left font-medium px-3 py-2 hidden md:table-cell">
                      Due Date
                    </th>
                  )}
                  <th className="text-right font-medium px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => {
                  const lead = getMemberById(project.leadId);
                  return (
                    <tr
                      key={project.id}
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="border-t border-border hover:bg-surface-hover cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2.5 font-medium text-accent">
                        {project.name}
                      </td>
                      {fields.has("priority") && (
                        <td className="px-3 py-2.5 hidden sm:table-cell">
                          <PriorityLabel priority={project.priority} />
                        </td>
                      )}
                      {fields.has("lead") && (
                        <td className="px-3 py-2.5 hidden sm:table-cell">
                          <Avatar member={lead} size="xs" />
                        </td>
                      )}
                      {fields.has("dueDate") && (
                        <td className="px-3 py-2.5 hidden md:table-cell text-text-muted">
                          {fmtDate(project.dueDate)}
                        </td>
                      )}
                      <td className="px-3 py-2.5 text-right">
                        <RowActionsMenu onDelete={() => {}} />
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t border-border">
                  <td colSpan={5} className="px-3 py-2">
                    <button
                      onClick={() => setAddOpen(true)}
                      className="flex items-center gap-1.5 text-sm text-text-subtle hover:text-text-muted"
                    >
                      <Plus size={14} />
                      Add Projects
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddProjectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(name) => addProject(name)}
      />
    </>
  );
}
