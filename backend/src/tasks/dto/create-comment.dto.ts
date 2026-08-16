import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: "Looks good to me!" })
  @IsNotEmpty()
  @IsString()
  body: string;
}
