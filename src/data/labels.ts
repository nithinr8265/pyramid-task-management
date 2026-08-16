import { Label, Status } from "@/types";

export const labels: Label[] = [
  { id: "research", name: "Research" },
  { id: "design", name: "Design" },
  { id: "development", name: "Development" },
  { id: "testing", name: "Testing" },
  { id: "deployment", name: "Deployment" },
  { id: "updated", name: "Updated" },
  { id: "audit", name: "Audit" },
  { id: "scheduled", name: "Scheduled" },
  { id: "passed", name: "Passed" },
  { id: "reviewing", name: "Reviewing" },
];

export function getLabelById(id: string): Label | undefined {
  return labels.find((l) => l.id === id);
}

export const statuses: Status[] = [
  { id: "todo", name: "To Do" },
  { id: "doing", name: "Doing" },
  { id: "completed", name: "Completed" },
  { id: "on-hold", name: "On Hold" },
];
