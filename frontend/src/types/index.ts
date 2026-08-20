// Core domain types for the Task Management System.
// Kept independent of any storage/service implementation so a real
// NestJS API can supply the same shapes later.

export type Priority = "no-priority" | "urgent" | "high" | "medium" | "low";

export type StatusId = "todo" | "doing" | "completed" | "on-hold";

export interface Status {
  id: StatusId;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  /** Fallback initials used when there's no avatar image */
  initials: string;
  /** Tailwind gradient classes used to render a colored avatar */
  color: string;
}

export interface Label {
  id: string;
  name: string;
}

export interface TaskResource {
  id?: string;
  name: string;
  url?: string;
  dataUrl?: string;
  mimeType?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string; // ISO date
  resources?: TaskResource[];
}

export interface UpdateEntry {
  id: string;
  authorId: string;
  message: string;
  createdAt: string; // ISO date
}

export interface Subtask {
  id: string;
  title: string;
  priority: Priority;
  memberIds: string[];
  dueDate?: string; // ISO date
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  status: StatusId;
  priority: Priority;
  memberIds: string[];
  reporterId?: string;
  labelIds: string[];
  teamIds?: string[];
  startDate?: string; // ISO date
  dueDate?: string; // ISO date
  resources?: TaskResource[];
  subtasks: Subtask[];
  comments: Comment[];
  updates: UpdateEntry[];
  watcherCount?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  leadId: string;
  dueDate?: string;
}

export type ViewMode = "board" | "list";

export type FieldKey =
  | "priority"
  | "members"
  | "dueDate"
  | "labels"
  | "status"
  | "reporter";

export type ThemeMode = "light" | "dark";

export type AccentColor =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";
