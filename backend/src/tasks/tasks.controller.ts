import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { CreateSubtaskDto } from "./dto/create-subtask.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";

@ApiTags("tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: "Get all tasks (with filters search, status, projectId)" })
  @Get()
  async findAll(@Query() query: TaskQueryDto, @Req() req: any) {
    return this.tasksService.findAll(query, req.user?.id);
  }

  @ApiOperation({ summary: "Get task by ID" })
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user?.id);
  }

  @ApiOperation({ summary: "Create task" })
  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(dto, req.user?.id);
  }

  @ApiOperation({ summary: "Update task" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: any
  ) {
    return this.tasksService.update(id, dto, req.user?.id);
  }

  @ApiOperation({ summary: "Delete task" })
  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    return this.tasksService.remove(id, req.user?.id);
  }

  // Resource routes
  @ApiOperation({ summary: "Add a resource to a task" })
  @Post(":id/resources")
  async addResource(
    @Param("id") id: string,
    @Body() dto: CreateResourceDto,
    @Req() req: any
  ) {
    return this.tasksService.addResource(id, dto, req.user?.id);
  }

  @ApiOperation({ summary: "Delete a resource from a task" })
  @Delete(":id/resources/:resourceId")
  async removeResource(
    @Param("id") id: string,
    @Param("resourceId") resourceId: string,
    @Req() req: any
  ) {
    return this.tasksService.removeResource(id, resourceId, req.user?.id);
  }

  // Subtask routes
  @ApiOperation({ summary: "Add a subtask to a task" })
  @Post(":id/subtasks")
  async addSubtask(
    @Param("id") id: string,
    @Body() dto: CreateSubtaskDto,
    @Req() req: any
  ) {
    return this.tasksService.addSubtask(id, dto, req.user?.id);
  }

  @ApiOperation({ summary: "Update a subtask" })
  @Patch(":id/subtasks/:subtaskId")
  async updateSubtask(
    @Param("id") id: string,
    @Param("subtaskId") subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
    @Req() req: any
  ) {
    return this.tasksService.updateSubtask(id, subtaskId, dto, req.user?.id);
  }

  // Comment route
  @ApiOperation({ summary: "Add a comment to a task" })
  @Post(":id/comments")
  async addComment(
    @Param("id") id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any
  ) {
    return this.tasksService.addComment(id, dto, req.user?.id);
  }
}
