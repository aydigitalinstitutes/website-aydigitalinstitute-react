import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersRepository } from './repositories/users.repository';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  const config = new ConfigService({
    JWT_ACCESS_SECRET: 'access',
    JWT_REFRESH_SECRET: 'refresh',
    JWT_ACCESS_TTL_SECONDS: '900',
    JWT_REFRESH_TTL_SECONDS: '604800',
    NODE_ENV: 'test',
    OAUTH_SUCCESS_REDIRECT: 'http://localhost/success',
  });

  const usersRepo: jest.Mocked<UsersRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createLocal: jest.fn(),
    upsertOAuth: jest.fn(),
  } as any;

  const refreshRepo: jest.Mocked<RefreshTokensRepository> = {
    store: jest.fn(),
    exists: jest.fn(),
    revoke: jest.fn(),
  } as any;

  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as any;

  const service = new AuthService(config, jwt, usersRepo, refreshRepo);

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.signAsync.mockImplementation(async () => 'token');
  });

  describe('register', () => {
    it('rejects when email already exists', async () => {
      usersRepo.findByEmail.mockResolvedValue({ id: 'u1' } as any);

      await expect(
        service.register({
          email: 'a@b.com',
          name: 'A',
          password: 'secret123',
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('creates local user and stores refresh token', async () => {
      usersRepo.findByEmail.mockResolvedValue(null);
      usersRepo.createLocal.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
      } as any);

      const result = await service.register({
        email: 'a@b.com',
        name: 'A',
        password: 'secret123',
      });

      expect(result.user.email).toBe('a@b.com');
      expect(jwt.signAsync).toHaveBeenCalledTimes(2);
      expect(refreshRepo.store).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('rejects invalid credentials when user missing', async () => {
      usersRepo.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'a@b.com', password: 'x' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects when account is inactive', async () => {
      const hash = await bcrypt.hash('admin123', 10);
      usersRepo.findByEmail.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
        isActive: false,
        passwordHash: hash,
      } as any);

      await expect(
        service.login({ email: 'a@b.com', password: 'admin123' }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('issues token pair on valid login', async () => {
      const hash = await bcrypt.hash('admin123', 10);
      usersRepo.findByEmail.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
        isActive: true,
        passwordHash: hash,
      } as any);

      const result = await service.login({
        email: 'a@b.com',
        password: 'admin123',
      });

      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(refreshRepo.store).toHaveBeenCalledTimes(1);
    });
  });

  describe('refresh', () => {
    it('rejects when missing refresh token', async () => {
      await expect(service.refresh(undefined)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects when refresh token invalid', async () => {
      jwt.verifyAsync.mockRejectedValueOnce(new Error('bad'));
      await expect(service.refresh('bad')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects when refresh token revoked', async () => {
      jwt.verifyAsync.mockResolvedValueOnce({
        sub: 'u1',
        tokenId: 't1',
        type: 'refresh',
      });
      refreshRepo.exists.mockResolvedValueOnce(false);

      await expect(service.refresh('r')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rotates refresh token and issues new pair', async () => {
      jwt.verifyAsync.mockResolvedValueOnce({
        sub: 'u1',
        tokenId: 't1',
        type: 'refresh',
      });
      refreshRepo.exists.mockResolvedValueOnce(true);
      usersRepo.findById.mockResolvedValueOnce({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
        isActive: true,
      } as any);

      const result = await service.refresh('r');

      expect(refreshRepo.revoke).toHaveBeenCalledWith('u1', 't1');
      expect(refreshRepo.store).toHaveBeenCalledTimes(1);
      expect(result.user.id).toBe('u1');
    });

    it('rejects when user not found', async () => {
      jwt.verifyAsync.mockResolvedValueOnce({
        sub: 'u1',
        tokenId: 't1',
        type: 'refresh',
      });
      refreshRepo.exists.mockResolvedValueOnce(true);
      usersRepo.findById.mockResolvedValueOnce(null);

      await expect(service.refresh('r')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects when user is inactive', async () => {
      jwt.verifyAsync.mockResolvedValueOnce({
        sub: 'u1',
        tokenId: 't1',
        type: 'refresh',
      });
      refreshRepo.exists.mockResolvedValueOnce(true);
      usersRepo.findById.mockResolvedValueOnce({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
        isActive: false,
      } as any);

      await expect(service.refresh('r')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('oauthLogin', () => {
    it('upserts user and issues token pair', async () => {
      usersRepo.upsertOAuth.mockResolvedValueOnce({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
        isActive: true,
      } as any);

      const result = await service.oauthLogin({
        provider: 'GOOGLE',
        providerId: 'p1',
        email: 'a@b.com',
        name: 'A',
      });

      expect(result.user.email).toBe('a@b.com');
      expect(refreshRepo.store).toHaveBeenCalledTimes(1);
    });

    it('rejects when oauth user is inactive', async () => {
      usersRepo.upsertOAuth.mockResolvedValueOnce({
        id: 'u1',
        email: 'a@b.com',
        name: 'A',
        role: 'USER',
        isActive: false,
      } as any);

      await expect(
        service.oauthLogin({
          provider: 'GOOGLE',
          providerId: 'p1',
          email: 'a@b.com',
          name: 'A',
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('silently returns when token missing', async () => {
      await expect(service.logout(undefined)).resolves.toBeUndefined();
    });

    it('revokes token when valid refresh token', async () => {
      jwt.verifyAsync.mockResolvedValueOnce({
        sub: 'u1',
        tokenId: 't1',
        type: 'refresh',
      });
      await service.logout('r');
      expect(refreshRepo.revoke).toHaveBeenCalledWith('u1', 't1');
    });

    it('ignores when token invalid', async () => {
      jwt.verifyAsync.mockRejectedValueOnce(new Error('bad'));
      await expect(service.logout('bad')).resolves.toBeUndefined();
    });
  });

  describe('redirect', () => {
    it('returns configured redirect', () => {
      expect(service.getOAuthSuccessRedirect()).toContain(
        'http://localhost/success',
      );
    });
  });

  describe('cookies', () => {
    it('sets and clears auth cookies', () => {
      const res = {
        cookie: jest.fn(),
        clearCookie: jest.fn(),
      } as any;

      service.setAuthCookies(res, {
        user: { id: 'u1', email: 'a@b.com', name: 'A', role: 'USER' },
        accessToken: 'a',
        refreshToken: 'r',
      });

      expect(res.cookie).toHaveBeenCalledTimes(2);

      service.clearAuthCookies(res);
      expect(res.clearCookie).toHaveBeenCalledTimes(2);
    });
  });
});
