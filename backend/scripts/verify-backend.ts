import { MongoMemoryReplSet } from "mongodb-memory-server";
import { PrismaClient, Priority, StatusId } from "@prisma/client";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";

async function runVerification() {
  console.log("=== STARTING FULL BACKEND & MONGODB VERIFICATION ===");

  console.log("\n1. Spinning up MongoMemoryReplSet (single-node rs0)...");
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, name: "rs0", dbName: "pyramid" },
  });
  let uri = `${replSet.getUri("pyramid")}&w=1`;
  console.log(`[PASS] MongoDB Memory Server running at: ${uri}`);

  process.env.DATABASE_URL = uri;
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.PORT = "3009";

  console.log("\n2. Connecting PrismaClient and running DB seed...");
  const prisma = new PrismaClient({
    datasources: { db: { url: uri } },
  });
  await prisma.$connect();

  const members = [
    { id: "admin", name: "Admin", email: "admin@pyramid.app", provider: "guest", initials: "A", color: "from-violet-500 to-fuchsia-500" },
    { id: "dexter", name: "Dexter", email: "dexter@gmail.com", provider: "google", initials: "D", color: "from-fuchsia-500 to-indigo-500" },
    { id: "guest", name: "Guest", email: "guest@pyramid.app", provider: "guest", initials: "G", color: "from-zinc-400 to-zinc-600" },
  ];
  for (const m of members) {
    const { id, ...data } = m;
    await prisma.user.upsert({ where: { id }, update: data, create: m });
  }

  const projects = [
    { id: "design-homepage", name: "Design Homepage", priority: Priority.HIGH, leadId: "dexter", dueDate: "2026-09-12" },
  ];
  for (const p of projects) {
    const { id, ...data } = p;
    await prisma.project.upsert({ where: { id }, update: data, create: p });
  }

  const tasks = [
    {
      id: "write-api-documentation",
      title: "Write API Documentation",
      description: "Create clear and detailed API documentation",
      projectId: "design-homepage",
      status: StatusId.TODO,
      priority: Priority.HIGH,
      memberIds: ["dexter"],
      reporterId: "admin",
      labelIds: ["research"],
      dueDate: "2026-07-31",
      watcherCount: 1,
      createdAt: new Date(),
      subtasks: [{ id: "sub-1", title: "Subtask 1", priority: Priority.HIGH, memberIds: [], dueDate: "2026-09-12", done: false }],
      comments: [{ id: "c-1", authorId: "dexter", body: "dsds", createdAt: new Date() }],
      updates: [{ id: "u-1", authorId: "dexter", message: "initial update", createdAt: new Date() }],
    },
  ];
  for (const t of tasks) {
    const { id, ...data } = t;
    await prisma.task.upsert({ where: { id }, update: data, create: t });
  }

  const userCount = await prisma.user.count();
  const projectCount = await prisma.project.count();
  const taskCount = await prisma.task.count();
  console.log(`[PASS] DB Seeded: ${userCount} users, ${projectCount} projects, ${taskCount} tasks.`);

  console.log("\n3. Booting NestJS Application Server on port 3009...");
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3009);
  console.log("[PASS] NestJS API listening at http://localhost:3009");

  const baseUrl = "http://localhost:3009";

  console.log("\n4. Testing API Endpoints...");

  // Health
  const resHealth = await fetch(`${baseUrl}/health`);
  const healthData = await resHealth.json();
  console.log(`[GET /health] Status: ${resHealth.status}, Body:`, healthData);
  if (resHealth.status !== 200 || healthData.status !== "ok") throw new Error("Health check failed");

  // Auth Guest
  const resGuest = await fetch(`${baseUrl}/auth/guest`, { method: "POST" });
  const guestData = await resGuest.json();
  console.log(`[POST /auth/guest] Status: ${resGuest.status}, User: ${guestData.user?.name}`);
  if (!guestData.accessToken) throw new Error("Guest login failed");

  const guestToken = guestData.accessToken;

  // Auth Google validation check (expect 400 when credential missing)
  const resGoogleInvalid = await fetch(`${baseUrl}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  console.log(`[POST /auth/google (empty)] Status: ${resGoogleInvalid.status} (Expected 400)`);
  if (resGoogleInvalid.status !== 400) throw new Error("Expected 400 for empty Google credential");

  // Auth Me
  const resMe = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${guestToken}` },
  });
  const meData = await resMe.json();
  console.log(`[GET /auth/me] Status: ${resMe.status}, Email: ${meData.email}`);
  if (resMe.status !== 200 || !meData.id) throw new Error("GET /auth/me failed");

  // Users
  const resUsers = await fetch(`${baseUrl}/users`);
  const usersData = await resUsers.json();
  console.log(`[GET /users] Status: ${resUsers.status}, Total Members: ${usersData.length}`);
  if (!Array.isArray(usersData) || usersData.length === 0) throw new Error("GET /users failed");

  // Projects CRUD
  const resProjects = await fetch(`${baseUrl}/projects`);
  const projectsData = await resProjects.json();
  console.log(`[GET /projects] Status: ${resProjects.status}, Total Projects: ${projectsData.length}`);

  const resNewProject = await fetch(`${baseUrl}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ name: "Verification Project", priority: "high" }),
  });
  const newProjectData = await resNewProject.json();
  console.log(`[POST /projects] Status: ${resNewProject.status}, ID: ${newProjectData.id}`);

  const resPatchProject = await fetch(`${baseUrl}/projects/${newProjectData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ name: "Updated Project Name" }),
  });
  const patchProjectData = await resPatchProject.json();
  console.log(`[PATCH /projects/${newProjectData.id}] Status: ${resPatchProject.status}, Updated Name: ${patchProjectData.name}`);

  const resDelProject = await fetch(`${baseUrl}/projects/${newProjectData.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${guestToken}` },
  });
  console.log(`[DELETE /projects/${newProjectData.id}] Status: ${resDelProject.status}`);

  // Tasks CRUD
  const resTasks = await fetch(`${baseUrl}/tasks`);
  const tasksData = await resTasks.json();
  console.log(`[GET /tasks] Status: ${resTasks.status}, Total Tasks: ${tasksData.length}`);

  const resNewTask = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ title: "Test Integration Task", status: "todo", projectId: "design-homepage" }),
  });
  const newTaskData = await resNewTask.json();
  console.log(`[POST /tasks] Status: ${resNewTask.status}, Task ID: ${newTaskData.id}`);

  const resSubtask = await fetch(`${baseUrl}/tasks/${newTaskData.id}/subtasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ title: "Verification Subtask 1" }),
  });
  const taskWithSubtask = await resSubtask.json();
  console.log(`[POST /tasks/:id/subtasks] Status: ${resSubtask.status}, Subtasks Count: ${taskWithSubtask.subtasks.length}`);

  const createdSubtaskId = taskWithSubtask.subtasks[0].id;
  const resToggleSubtask = await fetch(`${baseUrl}/tasks/${newTaskData.id}/subtasks/${createdSubtaskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ done: true }),
  });
  const toggledTask = await resToggleSubtask.json();
  console.log(`[PATCH /tasks/:id/subtasks/:subtaskId] Status: ${resToggleSubtask.status}, Subtask Done: ${toggledTask.subtasks[0].done}`);

  const resComment = await fetch(`${baseUrl}/tasks/${newTaskData.id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ body: "Verification comment body" }),
  });
  const taskWithComment = await resComment.json();
  console.log(`[POST /tasks/:id/comments] Status: ${resComment.status}, Comments Count: ${taskWithComment.comments.length}`);

  const resDelTask = await fetch(`${baseUrl}/tasks/${newTaskData.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${guestToken}` },
  });
  console.log(`[DELETE /tasks/${newTaskData.id}] Status: ${resDelTask.status}`);

  console.log("\n=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! ===");

  await app.close();
  await prisma.$disconnect();
  await replSet.stop();
  process.exit(0);
}

runVerification().catch((err) => {
  console.error("VERIFICATION FAILED:", err);
  process.exit(1);
});
