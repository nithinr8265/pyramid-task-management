import { PrismaClient, Priority, StatusId } from "@prisma/client";

const prisma = new PrismaClient();

const members = [
  {
    id: "admin",
    name: "Admin",
    email: "admin@pyramid.app",
    provider: "guest",
    initials: "A",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "dexter",
    name: "Dexter",
    email: "dexter@gmail.com",
    provider: "google",
    initials: "D",
    color: "from-fuchsia-500 to-indigo-500",
  },
  {
    id: "designer",
    name: "Designer",
    email: "designer@pyramid.app",
    provider: "guest",
    initials: "DX",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "cn",
    name: "Chidi Nwosu",
    email: "chidi@pyramid.app",
    provider: "guest",
    initials: "CN",
    color: "from-sky-500 to-cyan-500",
  },
  {
    id: "security",
    name: "Security Team",
    email: "security@pyramid.app",
    provider: "guest",
    initials: "S",
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "qa",
    name: "QA Team",
    email: "qa@pyramid.app",
    provider: "guest",
    initials: "QA",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "guest",
    name: "Guest",
    email: "guest@pyramid.app",
    provider: "guest",
    initials: "G",
    color: "from-zinc-400 to-zinc-600",
  },
];

const labels = [
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

const projects = [
  {
    id: "design-homepage",
    name: "Design Homepage",
    priority: Priority.HIGH,
    leadId: "dexter",
    dueDate: "2026-09-12",
  },
  {
    id: "review-login-feature",
    name: "Develop Login Feature",
    priority: Priority.LOW,
    leadId: "cn",
    dueDate: "2026-09-15",
  },
  {
    id: "test-payment-gateway",
    name: "Test Payment Gateway",
    priority: Priority.MEDIUM,
    leadId: "admin",
    dueDate: "2026-09-18",
  },
];

const tasks = [
  {
    id: "write-api-documentation",
    title: "Write API Documentation",
    description:
      "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.",
    projectId: "design-homepage",
    status: StatusId.TODO,
    priority: Priority.HIGH,
    memberIds: ["designer"],
    reporterId: "admin",
    labelIds: ["research", "design", "development", "testing", "deployment"],
    dueDate: "2026-07-31",
    watcherCount: 1,
    createdAt: new Date("2026-07-20T09:00:00.000Z"),
    subtasks: [
      {
        id: "sub-1",
        title: "Subtask 1",
        priority: Priority.HIGH,
        memberIds: [],
        dueDate: "2026-09-12",
        done: false,
      },
      {
        id: "sub-2",
        title: "Subtask 2",
        priority: Priority.LOW,
        memberIds: ["cn"],
        dueDate: "2026-09-15",
        done: false,
      },
      {
        id: "sub-3",
        title: "Subtask 3",
        priority: Priority.MEDIUM,
        memberIds: ["designer", "cn"],
        dueDate: "2026-09-18",
        done: false,
      },
    ],
    comments: [
      {
        id: "c-1",
        authorId: "dexter",
        body: "dsds",
        createdAt: new Date(),
      },
    ],
    updates: [
      {
        id: "u-1",
        authorId: "dexter",
        message: "changed priority from No priority to Urgent",
        createdAt: new Date("2026-08-01T09:00:00.000Z"),
      },
      {
        id: "u-2",
        authorId: "dexter",
        message: "posted an update",
        createdAt: new Date("2026-08-02T09:00:00.000Z"),
      },
    ],
  },
  {
    id: "implement-search-function",
    title: "Implement Search Function",
    description: "Add a fast, fuzzy search across tasks and projects.",
    projectId: "design-homepage",
    status: StatusId.TODO,
    priority: Priority.LOW,
    memberIds: ["admin"],
    reporterId: "admin",
    labelIds: ["deployment"],
    dueDate: "2026-07-29",
    createdAt: new Date("2026-07-18T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "deploy-to-production",
    title: "Deploy to Production",
    projectId: "test-payment-gateway",
    status: StatusId.TODO,
    priority: Priority.MEDIUM,
    memberIds: ["admin"],
    reporterId: "admin",
    labelIds: ["deployment"],
    dueDate: "2026-07-29",
    createdAt: new Date("2026-07-18T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "code-review-completed",
    title: "Code Review Completed",
    projectId: "review-login-feature",
    status: StatusId.DOING,
    priority: Priority.HIGH,
    memberIds: ["admin"],
    reporterId: "admin",
    labelIds: ["deployment"],
    dueDate: "2026-07-29",
    createdAt: new Date("2026-07-18T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "design-mockups-finalized",
    title: "Design Mockups Finalized",
    projectId: "design-homepage",
    status: StatusId.DOING,
    priority: Priority.MEDIUM,
    memberIds: ["admin"],
    reporterId: "admin",
    labelIds: ["deployment"],
    dueDate: "2026-07-29",
    createdAt: new Date("2026-07-18T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "feature-testing-passed",
    title: "Feature Testing Passed",
    projectId: "test-payment-gateway",
    status: StatusId.COMPLETED,
    priority: Priority.LOW,
    memberIds: ["qa"],
    reporterId: "admin",
    labelIds: ["testing", "passed"],
    dueDate: "2026-07-30",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "ui-design-updated",
    title: "UI Design Updated",
    projectId: "design-homepage",
    status: StatusId.COMPLETED,
    priority: Priority.MEDIUM,
    memberIds: ["designer"],
    reporterId: "admin",
    labelIds: ["design", "updated"],
    dueDate: "2026-07-31",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "security-audit-scheduled",
    title: "Security Audit Scheduled",
    projectId: "test-payment-gateway",
    status: StatusId.COMPLETED,
    priority: Priority.URGENT,
    memberIds: ["security"],
    reporterId: "admin",
    labelIds: ["audit", "scheduled"],
    dueDate: "2026-08-01",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "ui-reviewing",
    title: "UI Reviewing",
    projectId: "design-homepage",
    status: StatusId.ON_HOLD,
    priority: Priority.MEDIUM,
    memberIds: ["designer"],
    reporterId: "admin",
    labelIds: ["reviewing"],
    dueDate: "2026-08-02",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "backend-testing",
    title: "Backend Testing",
    projectId: "test-payment-gateway",
    status: StatusId.ON_HOLD,
    priority: Priority.LOW,
    memberIds: ["qa"],
    reporterId: "admin",
    labelIds: ["testing"],
    dueDate: "2026-08-03",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "user-feedback-review",
    title: "User Feedback Review",
    projectId: "review-login-feature",
    status: StatusId.ON_HOLD,
    priority: Priority.LOW,
    memberIds: ["admin"],
    reporterId: "admin",
    labelIds: ["research"],
    dueDate: "2026-08-04",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    projectId: "design-homepage",
    status: StatusId.ON_HOLD,
    priority: Priority.MEDIUM,
    memberIds: ["cn"],
    reporterId: "admin",
    labelIds: ["deployment"],
    dueDate: "2026-08-05",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "design-homepage-task",
    title: "Design Homepage",
    projectId: "design-homepage",
    status: StatusId.TODO,
    priority: Priority.HIGH,
    memberIds: ["dexter"],
    reporterId: "admin",
    labelIds: [],
    dueDate: "2026-09-12",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "develop-login-feature",
    title: "Develop Login Feature",
    projectId: "review-login-feature",
    status: StatusId.TODO,
    priority: Priority.LOW,
    memberIds: ["designer", "cn"],
    reporterId: "admin",
    labelIds: [],
    dueDate: "2026-09-15",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "test-payment-gateway-task",
    title: "Test Payment Gateway",
    projectId: "test-payment-gateway",
    status: StatusId.TODO,
    priority: Priority.MEDIUM,
    memberIds: ["security"],
    reporterId: "admin",
    labelIds: [],
    dueDate: "2026-09-18",
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    subtasks: [],
    comments: [],
    updates: [],
  },
];

async function main() {
  console.log("Seeding MongoDB database...");

  for (const m of members) {
    const { id, ...data } = m;
    await prisma.user.upsert({
      where: { id },
      update: data,
      create: m,
    });
  }

  for (const l of labels) {
    const { id, ...data } = l;
    await prisma.label.upsert({
      where: { id },
      update: data,
      create: l,
    });
  }

  for (const p of projects) {
    const { id, ...data } = p;
    await prisma.project.upsert({
      where: { id },
      update: data,
      create: p,
    });
  }

  for (const t of tasks) {
    const { id, ...data } = t;
    await prisma.task.upsert({
      where: { id },
      update: data,
      create: t,
    });
  }

  console.log("MongoDB Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
