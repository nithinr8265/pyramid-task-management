import { Project } from "@/types";

export const initialProjects: Project[] = [
  {
    id: "design-homepage",
    name: "Design Homepage",
    priority: "high",
    leadId: "dexter",
    dueDate: "2026-09-12",
  },
  {
    id: "review-login-feature",
    name: "Develop Login Feature",
    priority: "low",
    leadId: "cn",
    dueDate: "2026-09-15",
  },
  {
    id: "test-payment-gateway",
    name: "Test Payment Gateway",
    priority: "medium",
    leadId: "admin",
    dueDate: "2026-09-18",
  },
];
