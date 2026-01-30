import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UsersRepository } from './repositories/users.repository';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';
import {
  JwtAccessPayload,
  JwtRefreshPayload,
  OAuthProfile,
} from './types/auth.types';

export type AuthResult = {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
  accessToken: string;
  refreshToken: string;
  isLongSession?: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly usersRepo: UsersRepository,
    private readonly refreshRepo: RefreshTokensRepository,
  ) {}

  private accessSecret(): string {
    return this.config.get<string>('JWT_ACCESS_SECRET') ?? 'change-me';
  }

  private refreshSecret(): string {
    return this.config.get<string>('JWT_REFRESH_SECRET') ?? 'change-me-refresh';
  }

  private accessTtlSeconds(): number {
    return Number(this.config.get<string>('JWT_ACCESS_TTL_SECONDS') ?? 900);
  }

  private refreshTtlSeconds(isLongSession = false): number {
    if (isLongSession) {
      return 60 * 60 * 24 * 30; // 30 days
    }
    return Number(
      this.config.get<string>('JWT_REFRESH_TTL_SECONDS') ?? 60 * 60 * 24 * 7,
    );
  }

  getOAuthSuccessRedirect(): string {
    return this.config.get<string>('OAUTH_SUCCESS_REDIRECT') ?? '/';
  }

  async register(dto: {
    email: string;
    name: string;
    password: string;
    username?: string;
  }): Promise<AuthResult> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) {
      throw new ForbiddenException('Email is already registered');
    }

    if (dto.username) {
      const existingUsername = await this.usersRepo.findByEmailOrUsername(
        dto.username,
      );
      if (existingUsername) {
        throw new ForbiddenException('Username is already taken');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepo.createLocal({
      email: dto.email,
      name: dto.name,
      passwordHash,
      username: dto.username,
    });

    return this.issueTokensForUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'USER',
    });
  }

  async login(dto: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AuthResult> {
    const user = await this.usersRepo.findByEmailOrUsername(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokensForUser(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'ADMIN' | 'USER',
      },
      dto.rememberMe,
    );
  }

  async oauthLogin(profile: OAuthProfile): Promise<AuthResult> {
    const user = await this.usersRepo.upsertOAuth(profile);
    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }
    return this.issueTokensForUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'USER',
    });
  }

  async refresh(refreshToken?: string): Promise<AuthResult> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    let payload: JwtRefreshPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtRefreshPayload>(refreshToken, {
        secret: this.refreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh' || !payload.sub || !payload.tokenId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const exists = await this.refreshRepo.exists(payload.sub, payload.tokenId);
    if (!exists) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    await this.refreshRepo.revoke(payload.sub, payload.tokenId);

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    return this.issueTokensForUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'USER',
    });
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtRefreshPayload>(
        refreshToken,
        {
          secret: this.refreshSecret(),
        },
      );
      if (payload.type === 'refresh' && payload.sub && payload.tokenId) {
        await this.refreshRepo.revoke(payload.sub, payload.tokenId);
      }
    } catch {
      return;
    }
  }

  setAuthCookies(res: Response, result: AuthResult): void {
    const secure =
      (this.config.get<string>('NODE_ENV') ?? 'development') === 'production';

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: this.accessTtlSeconds() * 1000,
    });

    const refreshOptions: any = {
      httpOnly: true,
      secure,
      sameSite: 'strict',
    };

    if (result.isLongSession) {
      refreshOptions.maxAge = this.refreshTtlSeconds(true) * 1000;
    }

    res.cookie('refreshToken', result.refreshToken, refreshOptions);
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  private async issueTokensForUser(
    user: AuthResult['user'],
    isLongSession = false,
  ): Promise<AuthResult> {
    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const tokenId = crypto.randomUUID();
    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      tokenId,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.accessSecret(),
        expiresIn: this.accessTtlSeconds(),
      }),
      this.jwt.signAsync(refreshPayload, {
        secret: this.refreshSecret(),
        expiresIn: this.refreshTtlSeconds(isLongSession),
      }),
    ]);

    await this.refreshRepo.store(
      user.id,
      tokenId,
      this.refreshTtlSeconds(isLongSession),
    );

    return {
      user,
      accessToken,
      refreshToken,
      isLongSession,
    };
  }

  async updateProfile(
    userId: string,
    dto: {
      name?: string;
      username?: string;
      phoneNumber?: string;
      dob?: string;
      gender?: string;
    },
    file?: Express.Multer.File,
  ) {
    if (dto.username) {
      const existing = await this.usersRepo.findByEmailOrUsername(dto.username);
      if (existing && existing.id !== userId) {
        throw new ConflictException('Username is already taken');
      }
    }

    const updateData: any = { ...dto };
    // Remove avatarUrl from dto if present, as we handle it separately via file upload
    delete updateData.avatarUrl;

    if (dto.dob) {
      updateData.dob = new Date(dto.dob);
    }

    if (file) {
      updateData.avatarData = file.buffer;
      updateData.avatarMimeType = file.mimetype;
    }

    const updatedUser = await this.usersRepo.update(userId, updateData);

    // Construct avatar URL if avatar data exists
    const avatarUrl = updatedUser.avatarData
      ? `/api/v1/auth/avatar/${updatedUser.id}`
      : null;

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      username: updatedUser.username,
      phoneNumber: updatedUser.phoneNumber,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      avatarUrl,
    };
  }

  async getAvatar(userId: string) {
    const user = await this.usersRepo.findById(userId);
    if (!user || !user.avatarData) {
      throw new NotFoundException('Avatar not found');
    }
    return { buffer: user.avatarData, mimeType: user.avatarMimeType };
  }

  async changePassword(
    userId: string,
    dto: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.usersRepo.findById(userId);
    if (!user || !user.passwordHash) {
      throw new BadRequestException(
        'User has no password set or does not exist',
      );
    }

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) {
      throw new ForbiddenException('Invalid current password');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepo.update(userId, { passwordHash } as any);

    return { success: true };
  }
}
