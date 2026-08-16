import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Guest login" })
  @HttpCode(HttpStatus.OK)
  @Post("guest")
  async loginAsGuest() {
    return this.authService.loginAsGuest();
  }

  @ApiOperation({ summary: "Mock Google login" })
  @HttpCode(HttpStatus.OK)
  @Post("google")
  async loginWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto);
  }

  @ApiOperation({ summary: "Get currently authenticated user" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Req() req: any) {
    return this.authService.getCurrentUser(req.user.id);
  }
}
