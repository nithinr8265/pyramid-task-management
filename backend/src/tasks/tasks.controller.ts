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
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: "Get all tasks (with filters search, status, projectId)" })
  @Get()
  async findAll(@Query() query: TaskQueryDto) {
    return this.tasksService.findAll(query);
  }

  @ApiOperation({ summary: "Get task by ID" })
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.tasksService.findOne(id);
  }

  @ApiOperation({ summary: "Create task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(dto, req.user?.id);
  }

  @ApiOperation({ summary: "Update task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @ApiOperation({ summary: "Delete task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.tasksService.remove(id);
  }

  // Resource routes
  @ApiOperation({ summary: "Add a resource to a task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/resources")
  async addResource(@Param("id") id: string, @Body() dto: CreateResourceDto) {
    return this.tasksService.addResource(id, dto);
  }

  @ApiOperation({ summary: "Delete a resource from a task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id/resources/:resourceId")
  async removeResource(
    @Param("id") id: string,
    @Param("resourceId") resourceId: string
  ) {
    return this.tasksService.removeResource(id, resourceId);
  }

  // Subtask routes
  @ApiOperation({ summary: "Add a subtask to a task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/subtasks")
  async addSubtask(@Param("id") id: string, @Body() dto: CreateSubtaskDto) {
    return this.tasksService.addSubtask(id, dto);
  }

  @ApiOperation({ summary: "Update a subtask" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id/subtasks/:subtaskId")
  async updateSubtask(
    @Param("id") id: string,
    @Param("subtaskId") subtaskId: string,
    @Body() dto: UpdateSubtaskDto
  ) {
    return this.tasksService.updateSubtask(id, subtaskId, dto);
  }

  // Comment route
  @ApiOperation({ summary: "Add a comment to a task" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/comments")
  async addComment(
    @Param("id") id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any
  ) {
    return this.tasksService.addComment(id, dto, req.user?.id);
  }
}
