import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: {
    page: number;
    limit: number;
    search?: string;
    role?: 'USER' | 'ADMIN';
    isActive?: boolean;
  }) {
    const page = Math.max(1, params.page);
    const limit = Math.min(100, Math.max(1, params.limit));
    const search = params.search?.trim();

    const where: any = {
      ...(params.role ? { role: params.role } : {}),
      ...(typeof params.isActive === 'boolean' ? { isActive: params.isActive } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          provider: true,
          providerId: true,
          avatarUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { total, page, limit, data };
  }

  async update(id: string, data: { isActive?: boolean; role?: 'USER' | 'ADMIN' }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(typeof data.isActive === 'boolean' ? { isActive: data.isActive } : {}),
        ...(data.role ? { role: data.role } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }
}

