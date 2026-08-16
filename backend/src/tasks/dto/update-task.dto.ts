import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  watcherCount?: number;
}
