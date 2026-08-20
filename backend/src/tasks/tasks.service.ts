import { Injectable, NotFoundException } from "@nestjs/common";
import { Priority, StatusId } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { CreateSubtaskDto } from "./dto/create-subtask.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

function makeId(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()
    .toString(36)
    .slice(-5)}`;
}

function getUserTaskFilter(userId?: string) {
  if (!userId || userId === "guest" || userId === "admin") {
    return {
      OR: [
        { reporterId: { in: ["guest", "admin"] } },
        { reporterId: null },
        { memberIds: { has: "guest" } },
        { memberIds: { has: "admin" } },
      ],
    };
  }
  return {
    OR: [
      { reporterId: userId },
      { memberIds: { has: userId } },
    ],
  };
}

function isTaskAccessible(task: any, userId?: string): boolean {
  if (!userId || userId === "guest" || userId === "admin") {
    return (
      task.reporterId === "guest" ||
      task.reporterId === "admin" ||
      task.reporterId === null ||
      task.reporterId === undefined ||
      (Array.isArray(task.memberIds) &&
        (task.memberIds.includes("guest") || task.memberIds.includes("admin")))
    );
  }
  return (
    task.reporterId === userId ||
    (Array.isArray(task.memberIds) && task.memberIds.includes(userId))
  );
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private mapTask(t: any) {
    return {
      id: t.id,
      title: t.title,
      description: t.description || undefined,
      projectId: t.projectId || undefined,
      status: t.status as string,
      priority: t.priority as string,
      memberIds: t.memberIds || [],
      reporterId: t.reporterId || undefined,
      labelIds: t.labelIds || [],
      startDate: t.startDate || undefined,
      dueDate: t.dueDate || undefined,
      watcherCount: t.watcherCount ?? 0,
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
      resources: t.resources
        ? t.resources.map((r: any) => ({
            id: r.id || makeId("resource"),
            name: r.name || "Attachment",
            url: r.url || undefined,
            dataUrl: r.dataUrl || undefined,
            mimeType: r.mimeType || undefined,
          }))
        : [],
      subtasks: t.subtasks
        ? t.subtasks.map((s: any) => ({
            id: s.id,
            title: s.title,
            priority: s.priority as string,
            memberIds: s.memberIds || [],
            dueDate: s.dueDate || undefined,
            done: s.done ?? false,
          }))
        : [],
      comments: t.comments
        ? t.comments.map((c: any) => ({
            id: c.id,
            authorId: c.authorId,
            body: c.body || "",
            createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
            resources: c.resources
              ? c.resources.map((r: any) => ({
                  id: r.id || makeId("resource"),
                  name: r.name || "Attachment",
                  url: r.url || undefined,
                  dataUrl: r.dataUrl || undefined,
                  mimeType: r.mimeType || undefined,
                }))
              : [],
          }))
        : [],
      updates: t.updates
        ? t.updates.map((u: any) => ({
            id: u.id,
            authorId: u.authorId,
            message: u.message,
            createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
          }))
        : [],
    };
  }

  async findAll(query: TaskQueryDto, userId?: string) {
    const userFilter = getUserTaskFilter(userId);

    const where: any = {
      AND: [userFilter],
    };

    if (query.projectId) {
      where.AND.push({ projectId: query.projectId });
    }

    if (query.status) {
      where.AND.push({ status: query.status });
    }

    if (query.search) {
      where.AND.push({
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
        ],
      });
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return tasks.map((t) => this.mapTask(t));
  }

  async findOne(id: string, userId?: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task || !isTaskAccessible(task, userId)) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return this.mapTask(task);
  }

  async create(dto: CreateTaskDto, reporterId?: string) {
    const id = makeId(dto.title);
    const finalReporterId = reporterId || "guest";

    const task = await this.prisma.task.create({
      data: {
        id,
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        status: dto.status || StatusId.TODO,
        priority: dto.priority || Priority.NO_PRIORITY,
        memberIds: dto.memberIds || [],
        reporterId: finalReporterId,
        labelIds: dto.labelIds || [],
        dueDate: dto.dueDate,
        startDate: dto.startDate,
        resources: dto.resources
          ? dto.resources.map((r) => ({
              id: r.id || makeId("resource"),
              name: r.name || "Attachment",
              url: r.url,
              dataUrl: r.dataUrl,
              mimeType: r.mimeType,
            }))
          : [],
        subtasks: [],
        comments: [],
        updates: [],
      },
    });

    return this.mapTask(task);
  }

  async update(id: string, dto: UpdateTaskDto, userId?: string) {
    await this.findOne(id, userId);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.projectId !== undefined) data.projectId = dto.projectId;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate;
    if (dto.startDate !== undefined) data.startDate = dto.startDate;
    if (dto.watcherCount !== undefined) data.watcherCount = dto.watcherCount;
    if (dto.memberIds !== undefined) data.memberIds = dto.memberIds;
    if (dto.labelIds !== undefined) data.labelIds = dto.labelIds;

    const task = await this.prisma.task.update({
      where: { id },
      data,
    });

    return this.mapTask(task);
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id, userId);
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }

  // Nested: Resources
  async addResource(taskId: string, dto: CreateResourceDto, userId?: string) {
    await this.findOne(taskId, userId);

    const newResource = {
      id: makeId("resource"),
      name: dto.name || "Attachment",
      url: dto.url || undefined,
      dataUrl: dto.dataUrl || undefined,
      mimeType: dto.mimeType || undefined,
    };

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        resources: {
          push: newResource,
        },
      },
    });

    return this.mapTask(updatedTask);
  }

  async removeResource(
    taskId: string,
    resourceId: string,
    userId?: string
  ) {
    const existing = await this.findOne(taskId, userId);

    const resources = (existing.resources || []).filter(
      (r: any) => r.id !== resourceId
    );

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { resources },
    });

    return this.mapTask(updatedTask);
  }

  // Nested: Subtasks
  async addSubtask(taskId: string, dto: CreateSubtaskDto, userId?: string) {
    await this.findOne(taskId, userId);

    const newSubtask = {
      id: makeId("subtask"),
      title: dto.title,
      priority: dto.priority || Priority.NO_PRIORITY,
      memberIds: dto.memberIds || [],
      dueDate: dto.dueDate,
      done: false,
    };

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        subtasks: {
          push: newSubtask,
        },
      },
    });

    return this.mapTask(updatedTask);
  }

  async updateSubtask(
    taskId: string,
    subtaskId: string,
    dto: UpdateSubtaskDto,
    userId?: string
  ) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask || !isTaskAccessible(existingTask, userId)) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    const subtasks = existingTask.subtasks.map((s) => {
      if (s.id !== subtaskId) return s;
      return {
        ...s,
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
        ...(dto.done !== undefined && { done: dto.done }),
        ...(dto.memberIds !== undefined && { memberIds: dto.memberIds }),
      };
    });

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { subtasks },
    });

    return this.mapTask(updatedTask);
  }

  // Nested: Comments
  async addComment(taskId: string, dto: CreateCommentDto, authorId?: string) {
    const currentUserId = authorId || "guest";
    await this.findOne(taskId, currentUserId);

    const newComment = {
      id: makeId("comment"),
      authorId: currentUserId,
      body: dto.body || "",
      createdAt: new Date(),
      resources: dto.resources
        ? dto.resources.map((r: any) => ({
            id: r.id || makeId("resource"),
            name: r.name || "Attachment",
            url: r.url || undefined,
            dataUrl: r.dataUrl || undefined,
            mimeType: r.mimeType || undefined,
          }))
        : [],
    };

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        comments: {
          push: newComment,
        },
      },
    });

    return this.mapTask(updatedTask);
  }
}
