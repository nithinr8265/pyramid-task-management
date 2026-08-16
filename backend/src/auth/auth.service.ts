import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { GoogleLoginDto } from "./dto/google-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  private mapUserResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      color: user.color,
    };
  }

  async loginAsGuest() {
    let user = await this.prisma.user.findUnique({
      where: { id: "guest" },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: "guest",
          name: "Guest",
          email: "guest@pyramid.app",
          provider: "guest",
          initials: "G",
          color: "from-zinc-400 to-zinc-600",
        },
      });
    }

    const accessToken = this.generateToken(user.id, user.email);
    return {
      accessToken,
      user: this.mapUserResponse(user),
    };
  }

  async loginWithGoogle(dto: GoogleLoginDto) {
    const email = dto.email || "dexter@gmail.com";
    const name = dto.name || "Dexter";

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const id = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      user = await this.prisma.user.create({
        data: {
          id: id || "dexter",
          name,
          email,
          provider: "google",
          initials: initials || "D",
          color: "from-fuchsia-500 to-indigo-500",
        },
      });
    }

    const accessToken = this.generateToken(user.id, user.email);
    return {
      accessToken,
      user: this.mapUserResponse(user),
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;
    return this.mapUserResponse(user);
  }
}
