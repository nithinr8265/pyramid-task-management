import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";
import { PrismaService } from "../prisma/prisma.service";
import { GoogleLoginDto } from "./dto/google-login.dto";

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    const googleClientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    if (googleClientId) {
      this.googleClient = new OAuth2Client(googleClientId);
    }
  }

  private getGoogleClient(): OAuth2Client {
    if (!this.googleClient) {
      const googleClientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
      if (!googleClientId) {
        throw new InternalServerErrorException(
          "GOOGLE_CLIENT_ID is not configured on the server. Please configure GOOGLE_CLIENT_ID in your environment."
        );
      }
      this.googleClient = new OAuth2Client(googleClientId);
    }
    return this.googleClient;
  }

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

  private getRandomAvatarColor(): string {
    const colors = [
      "from-violet-500 to-fuchsia-500",
      "from-fuchsia-500 to-indigo-500",
      "from-amber-500 to-orange-500",
      "from-sky-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-rose-500 to-pink-500",
      "from-blue-500 to-indigo-600",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private computeInitials(name: string, email: string): string {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
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
    if (!dto.credential) {
      throw new BadRequestException("Google credential token is required");
    }

    const googleClientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    if (!googleClientId) {
      throw new InternalServerErrorException(
        "GOOGLE_CLIENT_ID is not configured on the server. Please set GOOGLE_CLIENT_ID in backend/.env"
      );
    }

    const client = this.getGoogleClient();
    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken: dto.credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch (error) {
      throw new UnauthorizedException(
        "Invalid or expired Google credential token"
      );
    }

    if (!payload || !payload.email || !payload.sub) {
      throw new UnauthorizedException(
        "Google credential payload is missing required fields (email or sub)"
      );
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name?.trim() || email.split("@")[0];

    // Find existing user by unique verified email
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      if (user.provider !== "google") {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { provider: "google" },
        });
      }
    } else {
      const baseId = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      let candidateId = baseId || `user-${payload.sub.slice(-6)}`;

      const existingWithId = await this.prisma.user.findUnique({
        where: { id: candidateId },
      });
      if (existingWithId) {
        candidateId = `${candidateId}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const initials = this.computeInitials(name, email);
      const color = this.getRandomAvatarColor();

      user = await this.prisma.user.create({
        data: {
          id: candidateId,
          name,
          email,
          provider: "google",
          initials,
          color,
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
