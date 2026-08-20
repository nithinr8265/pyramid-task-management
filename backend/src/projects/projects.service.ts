import { Injectable, NotFoundException } from "@nestjs/common";
import { Priority } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

function makeId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()
    .toString(36)
    .slice(-5)}`;
}

function getUserProjectFilter(userId?: string) {
  if (!userId || userId === "guest" || userId === "admin") {
    return {
      leadId: { in: ["guest", "admin", "cn", "designer", "qa", "security"] },
    };
  }
  return {
    leadId: userId,
  };
}

function isProjectAccessible(project: any, userId?: string): boolean {
  if (!userId || userId === "guest" || userId === "admin") {
    return ["guest", "admin", "cn", "designer", "qa", "security"].includes(
      project.leadId
    );
  }
  return project.leadId === userId;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapProject(p: any) {
    return {
      id: p.id,
      name: p.name,
      priority: p.priority as string,
      leadId: p.leadId,
      dueDate: p.dueDate || undefined,
    };
  }

  async findAll(userId?: string) {
    const where = getUserProjectFilter(userId);
    const projects = await this.prisma.project.findMany({ where });
    return projects.map((p) => this.mapProject(p));
  }

  async findOne(id: string, userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project || !isProjectAccessible(project, userId)) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return this.mapProject(project);
  }

  async create(dto: CreateProjectDto, userId?: string) {
    const id = makeId(dto.name);
    const finalLeadId = userId || "guest";

    const project = await this.prisma.project.create({
      data: {
        id,
        name: dto.name,
        priority: dto.priority || Priority.NO_PRIORITY,
        leadId: finalLeadId,
        dueDate: dto.dueDate,
      },
    });

    return this.mapProject(project);
  }

  async update(id: string, dto: UpdateProjectDto, userId?: string) {
    await this.findOne(id, userId);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.leadId !== undefined) data.leadId = dto.leadId;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate;

    const project = await this.prisma.project.update({
      where: { id },
      data,
    });

    return this.mapProject(project);
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id, userId);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
