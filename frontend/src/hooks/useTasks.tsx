"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Comment, Priority, StatusId, Subtask, Task } from "@/types";
import { api } from "@/lib/api";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    api
      .get<Task[]>("/tasks")
      .then((data) => {
        if (isMounted) {
          setTasks(data);
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
    (input: { title: string; status: StatusId; projectId?: string }) => {
      const tempId = makeId(input.title);
      const tempTask: Task = {
        id: tempId,
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

      setTasks((prev) => [...prev, tempTask]);

      api
        .post<Task>("/tasks", input)
        .then((createdTask) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === tempId ? createdTask : t))
          );
        })
        .catch((err) => {
          console.error("Failed to create task on server:", err);
        });

      return tempTask;
    },
    []
  );

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );

    api
      .patch<Task>(`/tasks/${id}`, patch)
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? updatedTask : t))
        );
      })
      .catch((err) => {
        console.error(`Failed to update task ${id}:`, err);
      });
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
    (taskId: string, body: string, authorId: string) => {
      const tempComment: Comment = {
        id: makeId("comment"),
        authorId,
        body,
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, comments: [...t.comments, tempComment] } : t
        )
      );

      api
        .post<Task>(`/tasks/${taskId}/comments`, { body })
        .then((updatedTask) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? updatedTask : t))
          );
        })
        .catch((err) => {
          console.error(`Failed to add comment to task ${taskId}:`, err);
        });
    },
    []
  );

  const addSubtask = useCallback((taskId: string, title: string) => {
    const tempSubtask: Subtask = {
      id: makeId("subtask"),
      title,
      priority: "no-priority",
      memberIds: [],
      done: false,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: [...t.subtasks, tempSubtask] }
          : t
      )
    );

    api
      .post<Task>(`/tasks/${taskId}/subtasks`, { title })
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updatedTask : t))
        );
      })
      .catch((err) => {
        console.error(`Failed to add subtask to task ${taskId}:`, err);
      });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
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

    api
      .patch<Task>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
        done: !currentDone,
      })
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updatedTask : t))
        );
      })
      .catch((err) => {
        console.error(`Failed to toggle subtask ${subtaskId}:`, err);
      });
  }, []);

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
