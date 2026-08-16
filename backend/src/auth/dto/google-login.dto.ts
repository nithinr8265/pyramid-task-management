import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class GoogleLoginDto {
  @ApiPropertyOptional({ example: "Dexter" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "dexter@gmail.com" })
  @IsOptional()
  @IsEmail()
  email?: string;
}
