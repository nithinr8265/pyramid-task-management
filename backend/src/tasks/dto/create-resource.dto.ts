import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateResourceDto {
  @ApiProperty({ example: "Project Proposal" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "https://example.com/doc" })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: "data:application/pdf;base64,..." })
  @IsOptional()
  @IsString()
  dataUrl?: string;

  @ApiPropertyOptional({ example: "application/pdf" })
  @IsOptional()
  @IsString()
  mimeType?: string;
}
