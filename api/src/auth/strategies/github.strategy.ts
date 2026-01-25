import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { OAuthProfile } from '../types/auth.types';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GITHUB_CLIENT_ID') ?? '',
      clientSecret: config.get<string>('GITHUB_CLIENT_SECRET') ?? '',
      callbackURL:
        config.get<string>('GITHUB_CALLBACK_URL') ??
        'http://localhost:5001/api/v1/auth/github/redirect',
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<OAuthProfile> {
    const email = profile?.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Email not available from GitHub');
    }
    return {
      provider: 'GITHUB',
      providerId: String(profile.id),
      email: String(email),
      name: String(profile.displayName ?? profile.username ?? email),
      avatarUrl: profile?.photos?.[0]?.value
        ? String(profile.photos[0].value)
        : undefined,
    };
  }
}
