"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Comment, Priority, StatusId, Subtask, Task } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { initialTasks } from "@/data/tasks";

interface TasksContextValue {
  tasks: Task[];
  hydrated: boolean;
  getTask: (id: string) => Task | undefined;
  addTask: (input: {
    title: string;
    status: StatusId;
    projectId?: string;
  }) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: StatusId) => void;
  addComment: (taskId: string, body: string, authorId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function makeId(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()
    .toString(36)
    .slice(-5)}`;
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks, hydrated] = useLocalStorage<Task[]>(
    STORAGE_KEYS.tasks,
    initialTasks
  );

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  );

  const addTask = useCallback(
    (input: { title: string; status: StatusId; projectId?: string }) => {
      const task: Task = {
        id: makeId(input.title),
        title: input.title,
        status: input.status,
        priority: "no-priority" as Priority,
        memberIds: [],
        labelIds: [],
        projectId: input.projectId,
        subtasks: [],
        comments: [],
        updates: [],
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, task]);
      return task;
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );

  const moveTask = useCallback(
    (id: string, status: StatusId) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    },
    [setTasks]
  );

  const addComment = useCallback(
    (taskId: string, body: string, authorId: string) => {
      const comment: Comment = {
        id: makeId("comment"),
        authorId,
        body,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
        )
      );
    },
    [setTasks]
  );

  const addSubtask = useCallback(
    (taskId: string, title: string) => {
      const subtask: Subtask = {
        id: makeId("subtask"),
        title,
        priority: "no-priority",
        memberIds: [],
        done: false,
      };
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: [...t.subtasks, subtask] }
            : t
        )
      );
    },
    [setTasks]
  );

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, done: !s.done } : s
                ),
              }
            : t
        )
      );
    },
    [setTasks]
  );

  const value = useMemo(
    () => ({
      tasks,
      hydrated,
      getTask,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addComment,
      addSubtask,
      toggleSubtask,
    }),
    [
      tasks,
      hydrated,
      getTask,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addComment,
      addSubtask,
      toggleSubtask,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
  return ctx;
}
