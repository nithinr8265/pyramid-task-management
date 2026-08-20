import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiPropertyOptional({ example: "Looks good to me!" })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    example: [
      {
        name: "document.pdf",
        url: "https://example.com",
        dataUrl: "data:application/pdf;base64,...",
        mimeType: "application/pdf",
      },
    ],
  })
  @IsOptional()
  @IsArray()
  resources?: {
    id?: string;
    name: string;
    url?: string;
    dataUrl?: string;
    mimeType?: string;
  }[];
}
