import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @ApiProperty({ example: "New Dashboard Feature" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: Priority, example: "high" })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.toUpperCase().replace(/-/g, "_") : value
  )
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: "admin" })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiPropertyOptional({ example: "2026-09-30" })
  @IsOptional()
  @IsString()
  dueDate?: string;
}
