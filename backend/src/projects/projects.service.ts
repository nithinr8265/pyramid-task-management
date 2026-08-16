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

  async findAll() {
    const projects = await this.prisma.project.findMany();
    return projects.map((p) => this.mapProject(p));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return this.mapProject(project);
  }

  async create(dto: CreateProjectDto, userId?: string) {
    const id = makeId(dto.name);
    const leadId = dto.leadId || userId || "admin";

    // Ensure lead user exists or fallback to admin/guest
    const leadUser = await this.prisma.user.findUnique({ where: { id: leadId } });
    const finalLeadId = leadUser ? leadId : "admin";

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

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.leadId && { leadId: dto.leadId }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
      },
    });

    return this.mapProject(project);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
