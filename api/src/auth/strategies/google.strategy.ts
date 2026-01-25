import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { OAuthProfile } from '../types/auth.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL') ?? 'http://localhost:5001/api/v1/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any): Promise<OAuthProfile> {
    const email = profile?.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Email not available from Google');
    }
    return {
      provider: 'GOOGLE',
      providerId: String(profile.id),
      email: String(email),
      name: String(profile.displayName ?? email),
      avatarUrl: profile?.photos?.[0]?.value ? String(profile.photos[0].value) : undefined,
    };
  }
}

