import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OAuthProfile } from '../types/auth.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  createLocal(data: { email: string; name: string; passwordHash: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        provider: 'LOCAL',
      },
    });
  }

  upsertOAuth(profile: OAuthProfile) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { email: profile.email } });
      if (existing) {
        return tx.user.update({
          where: { id: existing.id },
          data: {
            provider: profile.provider,
            providerId: profile.providerId,
            avatarUrl: profile.avatarUrl,
            name: existing.name || profile.name,
          },
        });
      }

      return tx.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          provider: profile.provider,
          providerId: profile.providerId,
          avatarUrl: profile.avatarUrl,
          isActive: true,
        },
      });
    });
  }
}

