"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Comment, Priority, StatusId, Subtask, Task, TaskResource, UpdateEntry } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

interface ApiResource {
  id?: string;
  name: string;
  url?: string;
  dataUrl?: string;
  mimeType?: string;
}

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
  body?: string;
  createdAt?: string | Date;
  resources?: ApiResource[];
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
  resources?: ApiResource[];
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
  addResource: (
    taskId: string,
    resource: { name: string; url?: string; dataUrl?: string; mimeType?: string }
  ) => Promise<void>;
  deleteResource: (taskId: string, resourceId: string) => Promise<void>;
  addComment: (
    taskId: string,
    body?: string,
    authorId?: string,
    resources?: TaskResource[]
  ) => Promise<void>;
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

  const resources: TaskResource[] = Array.isArray(t.resources)
    ? t.resources.map((r) => ({
        id: r.id,
        name: r.name || "Attachment",
        url: r.url || undefined,
        dataUrl: r.dataUrl || undefined,
        mimeType: r.mimeType || undefined,
      }))
    : [];

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
        body: c.body || "",
        createdAt:
          c.createdAt instanceof Date
            ? c.createdAt.toISOString()
            : typeof c.createdAt === "string"
            ? c.createdAt
            : new Date().toISOString(),
        resources: Array.isArray(c.resources)
          ? c.resources.map((r) => ({
              id: r.id,
              name: r.name || "Attachment",
              url: r.url || undefined,
              dataUrl: r.dataUrl || undefined,
              mimeType: r.mimeType || undefined,
            }))
          : [],
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
    resources,
    watcherCount: t.watcherCount ?? 0,
    createdAt: createdAtStr,
    subtasks,
    comments,
    updates,
  };
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const tasksRef = useRef<Task[]>(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    let isMounted = true;

    if (!session?.accessToken) {
      return () => {
        isMounted = false;
      };
    }

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
  }, [session?.accessToken]);

  const activeTasks = useMemo(
    () => (session?.accessToken ? tasks : []),
    [session?.accessToken, tasks]
  );

  const getTask = useCallback(
    (id: string) => activeTasks.find((t) => t.id === id),
    [activeTasks]
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

  const addResource = useCallback(
    async (
      taskId: string,
      resource: { name: string; url?: string; dataUrl?: string; mimeType?: string }
    ) => {
      const updatedTask = await api.post<ApiTask>(
        `/tasks/${taskId}/resources`,
        resource
      );
      const normalized = normalizeTask(updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? normalized : t))
      );
    },
    []
  );

  const deleteResource = useCallback(
    async (taskId: string, resourceId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                resources: (t.resources || []).filter((r) => r.id !== resourceId),
              }
            : t
        )
      );

      try {
        const updatedTask = await api.del<ApiTask>(
          `/tasks/${taskId}/resources/${resourceId}`
        );
        if (updatedTask && updatedTask.id) {
          const normalized = normalizeTask(updatedTask);
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? normalized : t))
          );
        }
      } catch (err) {
        console.error(`Failed to delete resource ${resourceId}:`, err);
      }
    },
    []
  );

  const addComment = useCallback(
    async (
      taskId: string,
      body?: string,
      _authorId?: string,
      resources?: TaskResource[]
    ) => {
      try {
        const updatedTask = await api.post<ApiTask>(
          `/tasks/${taskId}/comments`,
          { body: body || "", resources }
        );
        const normalized = normalizeTask(updatedTask);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? normalized : t))
        );
      } catch (err) {
        console.error(`Failed to add comment to task ${taskId}:`, err);
        throw err;
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
      const currentTask = tasksRef.current.find((t) => t.id === taskId);
      const currentSub = currentTask?.subtasks.find((s) => s.id === subtaskId);
      const newDone = currentSub ? !currentSub.done : true;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, done: newDone } : s
            ),
          };
        })
      );

      try {
        const updatedTask = await api.patch<ApiTask>(
          `/tasks/${taskId}/subtasks/${subtaskId}`,
          {
            done: newDone,
          }
        );
        const normalized = normalizeTask(updatedTask);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? normalized : t))
        );
      } catch (err) {
        console.error(`Failed to toggle subtask ${subtaskId}:`, err);
        // Revert on error
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !newDone } : s
              ),
            };
          })
        );
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      tasks: activeTasks,
      hydrated,
      getTask,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addResource,
      deleteResource,
      addComment,
      addSubtask,
      toggleSubtask,
    }),
    [
      activeTasks,
      hydrated,
      getTask,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addResource,
      deleteResource,
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
