import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
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

  private refreshTtlSeconds(): number {
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
  }): Promise<AuthResult> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) {
      throw new ForbiddenException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepo.createLocal({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    return this.issueTokensForUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'USER',
    });
  }

  async login(dto: { email: string; password: string }): Promise<AuthResult> {
    const user = await this.usersRepo.findByEmail(dto.email);
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

    return this.issueTokensForUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'USER',
    });
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

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: this.refreshTtlSeconds() * 1000,
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  private async issueTokensForUser(
    user: AuthResult['user'],
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
        expiresIn: this.refreshTtlSeconds(),
      }),
    ]);

    await this.refreshRepo.store(user.id, tokenId, this.refreshTtlSeconds());

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
