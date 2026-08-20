"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FieldKey, StatusId, ViewMode } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskListView } from "@/components/tasks/TaskListView";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  emptyFilters,
  TaskFilters,
} from "@/components/navigation/FilterMenu";

const DEFAULT_FIELDS: FieldKey[] = ["priority", "members", "dueDate", "labels"];

export default function TasksPage() {
  const { tasks, addTask, deleteTask, moveTask } = useTasks();
  const { setCollapsed } = useSidebarCollapsed();

  const [view, setView] = useLocalStorage<ViewMode>("pyramid:tasks-view", "board");
  const [fieldList, setFieldList] = useLocalStorage<FieldKey[]>(
    "pyramid:tasks-fields",
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

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filters.status.size && !filters.status.has(t.status)) return false;
      if (filters.priority.size && !filters.priority.has(t.priority))
        return false;
      if (
        filters.memberIds.size &&
        !t.memberIds.some((id) => filters.memberIds.has(id))
      )
        return false;
      if (
        filters.labelIds.size &&
        !t.labelIds.some((id) => filters.labelIds.has(id))
      )
        return false;
      return true;
    });
  }, [tasks, search, filters]);

  return (
    <>
      <TopBar
        title="Tasks"
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
          title={search || filters ? "No matching tasks" : "No tasks yet"}
          description={
            search
              ? `Nothing matches "${search}". Try a different search.`
              : "Create your first task to get started."
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
        />
      )}

      <AddTaskModal
        open={addModalStatus !== null}
        defaultStatus={addModalStatus ?? "todo"}
        onClose={() => setAddModalStatus(null)}
        onSubmit={addTask}
      />
    </>
  );
}
