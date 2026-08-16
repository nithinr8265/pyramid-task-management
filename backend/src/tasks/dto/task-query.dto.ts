import { ApiPropertyOptional } from "@nestjs/swagger";
import { StatusId } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class TaskQueryDto {
  @ApiPropertyOptional({ example: "design-homepage" })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ enum: StatusId, example: "todo" })
  @IsOptional()
  @IsEnum(StatusId)
  status?: StatusId;

  @ApiPropertyOptional({ example: "API Documentation" })
  @IsOptional()
  @IsString()
  search?: string;
}
