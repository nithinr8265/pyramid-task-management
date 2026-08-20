import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectsService } from "./projects.service";

@ApiTags("projects")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: "Get all projects" })
  @Get()
  async findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user?.id);
  }

  @ApiOperation({ summary: "Get project by ID" })
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    return this.projectsService.findOne(id, req.user?.id);
  }

  @ApiOperation({ summary: "Create a new project" })
  @Post()
  async create(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(dto, req.user?.id);
  }

  @ApiOperation({ summary: "Update project" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: any
  ) {
    return this.projectsService.update(id, dto, req.user?.id);
  }

  @ApiOperation({ summary: "Delete project" })
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    return this.projectsService.remove(id, req.user?.id);
  }
}
