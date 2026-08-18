import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GoogleLoginDto {
  @ApiProperty({
    description: "Google ID Token (credential) returned by Google Identity Services",
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  })
  @IsNotEmpty({ message: "Google credential token is required" })
  @IsString()
  credential: string;
}
