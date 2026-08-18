"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Comment, Priority, StatusId, Subtask, Task, UpdateEntry } from "@/types";
import { api } from "@/lib/api";

interface ApiSubtask {
  id: string;
  title: string;
  priority?: string;
  memberIds?: string[];
  dueDate?: string;
  done?: boolean;
}

interface ApiComment {
  id: string;
  authorId: string;
  body: string;
  createdAt?: string | Date;
}

interface ApiUpdate {
  id: string;
  authorId: string;
  message: string;
  createdAt?: string | Date;
}

interface ApiTask {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  memberIds?: string[];
  reporterId?: string;
  labelIds?: string[];
  teamIds?: string[];
  startDate?: string;
  dueDate?: string;
  resources?: { label: string; url: string }[];
  watcherCount?: number;
  createdAt?: string | Date;
  subtasks?: ApiSubtask[];
  comments?: ApiComment[];
  updates?: ApiUpdate[];
}

interface TasksContextValue {
  tasks: Task[];
  hydrated: boolean;
  getTask: (id: string) => Task | undefined;
  addTask: (input: {
    title: string;
    status: StatusId;
    projectId?: string;
    priority?: Priority;
    description?: string;
    dueDate?: string;
    startDate?: string;
    memberIds?: string[];
    labelIds?: string[];
  }) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: StatusId) => void;
  addComment: (taskId: string, body: string, authorId?: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function normalizeStatus(status?: string): StatusId {
  if (!status) return "todo";
  const s = status.toLowerCase().replace(/_/g, "-");
  if (s === "doing" || s === "completed" || s === "on-hold" || s === "todo") {
    return s as StatusId;
  }
  return "todo";
}

function normalizePriority(priority?: string): Priority {
  if (!priority) return "no-priority";
  const p = priority.toLowerCase().replace(/_/g, "-");
  if (
    p === "urgent" ||
    p === "high" ||
    p === "medium" ||
    p === "low" ||
    p === "no-priority"
  ) {
    return p as Priority;
  }
  return "no-priority";
}

function normalizeTask(t: ApiTask): Task {
  const createdAtStr =
    t.createdAt instanceof Date
      ? t.createdAt.toISOString()
      : typeof t.createdAt === "string"
      ? t.createdAt
      : new Date().toISOString();

  const subtasks: Subtask[] = Array.isArray(t.subtasks)
    ? t.subtasks.map((s) => ({
        id: s.id,
        title: s.title,
        priority: normalizePriority(s.priority),
        memberIds: Array.isArray(s.memberIds) ? s.memberIds : [],
        dueDate: s.dueDate || undefined,
        done: Boolean(s.done),
      }))
    : [];

  const comments: Comment[] = Array.isArray(t.comments)
    ? t.comments.map((c) => ({
        id: c.id,
        authorId: c.authorId,
        body: c.body,
        createdAt:
          c.createdAt instanceof Date
            ? c.createdAt.toISOString()
            : typeof c.createdAt === "string"
            ? c.createdAt
            : new Date().toISOString(),
      }))
    : [];

  const updates: UpdateEntry[] = Array.isArray(t.updates)
    ? t.updates.map((u) => ({
        id: u.id,
        authorId: u.authorId,
        message: u.message,
        createdAt:
          u.createdAt instanceof Date
            ? u.createdAt.toISOString()
            : typeof u.createdAt === "string"
            ? u.createdAt
            : new Date().toISOString(),
      }))
    : [];

  return {
    id: t.id,
    title: t.title,
    description: t.description || undefined,
    projectId: t.projectId || undefined,
    status: normalizeStatus(t.status),
    priority: normalizePriority(t.priority),
    memberIds: Array.isArray(t.memberIds) ? t.memberIds : [],
    reporterId: t.reporterId || undefined,
    labelIds: Array.isArray(t.labelIds) ? t.labelIds : [],
    teamIds: Array.isArray(t.teamIds) ? t.teamIds : undefined,
    startDate: t.startDate || undefined,
    dueDate: t.dueDate || undefined,
    resources: Array.isArray(t.resources) ? t.resources : undefined,
    watcherCount: t.watcherCount ?? 0,
    createdAt: createdAtStr,
    subtasks,
    comments,
    updates,
  };
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    api
      .get<ApiTask[]>("/tasks")
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setTasks(data.map(normalizeTask));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      })
      .finally(() => {
        if (isMounted) {
          setHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  );

  const addTask = useCallback(
    async (input: {
      title: string;
      status: StatusId;
      projectId?: string;
      priority?: Priority;
      description?: string;
      dueDate?: string;
      startDate?: string;
      memberIds?: string[];
      labelIds?: string[];
    }) => {
      const createdTask = await api.post<ApiTask>("/tasks", input);
      const normalized = normalizeTask(createdTask);
      setTasks((prev) => [normalized, ...prev]);
      return normalized;
    },
    []
  );

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );

    try {
      const updatedTask = await api.patch<ApiTask>(`/tasks/${id}`, patch);
      const normalized = normalizeTask(updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? normalized : t))
      );
    } catch (err) {
      console.error(`Failed to update task ${id}:`, err);
    }
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));

    api.del(`/tasks/${id}`).catch((err) => {
      console.error(`Failed to delete task ${id}:`, err);
    });
  }, []);

  const moveTask = useCallback(
    (id: string, status: StatusId) => {
      updateTask(id, { status });
    },
    [updateTask]
  );

  const addComment = useCallback(
    async (taskId: string, body: string) => {
      try {
        const updatedTask = await api.post<ApiTask>(
          `/tasks/${taskId}/comments`,
          { body }
        );
        const normalized = normalizeTask(updatedTask);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? normalized : t))
        );
      } catch (err) {
        console.error(`Failed to add comment to task ${taskId}:`, err);
      }
    },
    []
  );

  const addSubtask = useCallback(async (taskId: string, title: string) => {
    try {
      const updatedTask = await api.post<ApiTask>(
        `/tasks/${taskId}/subtasks`,
        { title }
      );
      const normalized = normalizeTask(updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? normalized : t))
      );
    } catch (err) {
      console.error(`Failed to add subtask to task ${taskId}:`, err);
    }
  }, []);

  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      let currentDone = false;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const sub = t.subtasks.find((s) => s.id === subtaskId);
          if (sub) currentDone = sub.done;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, done: !s.done } : s
            ),
          };
        })
      );

      try {
        const updatedTask = await api.patch<ApiTask>(
          `/tasks/${taskId}/subtasks/${subtaskId}`,
          {
            done: !currentDone,
          }
        );
        const normalized = normalizeTask(updatedTask);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? normalized : t))
        );
      } catch (err) {
        console.error(`Failed to toggle subtask ${subtaskId}:`, err);
      }
    },
    []
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

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
  return ctx;
}
