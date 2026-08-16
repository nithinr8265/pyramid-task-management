import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubtaskDto {
  @ApiProperty({ example: "Subtask 1" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ enum: Priority, example: "medium" })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: ["cn"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @ApiPropertyOptional({ example: "2026-09-15" })
  @IsOptional()
  @IsString()
  dueDate?: string;
}
