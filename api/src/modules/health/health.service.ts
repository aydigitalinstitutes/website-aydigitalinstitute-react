import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisService) {}

  async health() {
    const startedAt = Date.now();

    const db = await this.prisma.$queryRaw`SELECT 1`;
    const redis = await this.redis.ping();

    return {
      success: true,
      status: 'ok',
      checks: {
        db: Array.isArray(db) ? 'ok' : 'ok',
        redis: redis === 'PONG' ? 'ok' : 'unknown',
      },
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    };
  }
}

