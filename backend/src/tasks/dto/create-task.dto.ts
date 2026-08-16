import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Priority, StatusId } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: "Write API Documentation" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ enum: StatusId, example: "todo" })
  @IsOptional()
  @IsEnum(StatusId)
  status?: StatusId;

  @ApiPropertyOptional({ enum: Priority, example: "high" })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: "design-homepage" })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ example: "Detailed task description..." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "2026-07-31" })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({ example: "2026-07-20" })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: ["designer", "cn"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @ApiPropertyOptional({ example: ["research", "design"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelIds?: string[];
}
