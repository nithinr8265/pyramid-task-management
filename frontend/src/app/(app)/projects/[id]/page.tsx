"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, SearchX } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FieldKey, StatusId, ViewMode } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskListView } from "@/components/tasks/TaskListView";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { emptyFilters, TaskFilters } from "@/components/navigation/FilterMenu";

const DEFAULT_FIELDS: FieldKey[] = ["priority", "members", "dueDate"];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { tasks, addTask, deleteTask, moveTask } = useTasks();
  const { getProject } = useProjects();
  const { setCollapsed } = useSidebarCollapsed();
  const project = getProject(id);

  const [view, setView] = useLocalStorage<ViewMode>(
    `pyramid:project-${id}-view`,
    "board"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(`pyramid:project-${id}-view`);
      if (!saved) {
        const isDesktopOrLaptop = window.innerWidth >= 1024;
        setView(isDesktopOrLaptop ? "board" : "list");
      }
    }
  }, [id, setView]);
  const [fieldList, setFieldList] = useLocalStorage<FieldKey[]>(
    `pyramid:project-${id}-fields`,
    DEFAULT_FIELDS
  );
  const fields = new Set(fieldList);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TaskFilters>(emptyFilters());
  const [addModalStatus, setAddModalStatus] = useState<StatusId | null>(null);

  function toggleField(key: FieldKey) {
    setFieldList((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }

  const scoped = useMemo(
    () => tasks.filter((t) => t.projectId === id),
    [tasks, id]
  );

  const filtered = useMemo(() => {
    return scoped.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filters.status.size && !filters.status.has(t.status)) return false;
      if (filters.priority.size && !filters.priority.has(t.priority))
        return false;
      if (
        filters.memberIds.size &&
        !t.memberIds.some((mid) => filters.memberIds.has(mid))
      )
        return false;
      return true;
    });
  }, [scoped, search, filters]);

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-10 text-center">
        <p className="text-sm font-medium">Project not found</p>
        <Link href="/projects" className="text-sm text-accent underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <TopBar
        title="Tasks"
        breadcrumb={
          <nav className="flex items-center gap-1.5 text-sm text-text-muted">
            <Link href="/projects" className="hover:text-text">
              Projects
            </Link>
            <ChevronRight size={13} className="text-text-subtle" />
            <span className="text-text font-medium">{project.name}</span>
          </nav>
        }
        onToggleSidebar={() => setCollapsed((c) => !c)}
        view={view}
        onViewChange={setView}
        fields={fields}
        onToggleField={toggleField}
        filters={filters}
        onFiltersChange={setFilters}
        search={search}
        onSearchChange={setSearch}
        addLabel="Add Task"
        onAdd={() => setAddModalStatus("todo")}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX size={20} />}
          title={search ? "No matching tasks" : "No tasks in this project yet"}
          description={
            search
              ? `Nothing matches "${search}".`
              : "Add a task to get this project moving."
          }
        />
      ) : view === "board" ? (
        <TaskBoard
          tasks={filtered}
          fields={fields}
          onAddTask={(status) => setAddModalStatus(status)}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
        />
      ) : (
        <TaskListView
          tasks={filtered}
          fields={fields}
          onAddTask={(status) => setAddModalStatus(status)}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
        />
      )}

      <AddTaskModal
        open={addModalStatus !== null}
        defaultStatus={addModalStatus ?? "todo"}
        onClose={() => setAddModalStatus(null)}
        onSubmit={(input) => addTask({ ...input, projectId: id })}
      />
    </>
  );
}
