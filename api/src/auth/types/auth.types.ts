export type JwtAccessPayload = {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type JwtRefreshPayload = {
  sub: string;
  tokenId: string;
  type: 'refresh';
};

export type OAuthProfile = {
  provider: 'GOOGLE' | 'GITHUB';
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

