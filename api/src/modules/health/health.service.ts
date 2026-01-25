import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import * as os from 'os';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async health() {
    const startedAt = Date.now();
    let dbStatus = 'unknown';
    let redisStatus = 'unknown';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch (e) {
      dbStatus = 'down';
    }

    try {
      const ping = await this.redis.ping();
      redisStatus = ping === 'PONG' ? 'up' : 'down';
    } catch (e) {
      redisStatus = 'down';
    }

    const memoryUsage = process.memoryUsage();
    
    return {
      status: dbStatus === 'up' && redisStatus === 'up' ? 'up' : 'down',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: {
          status: dbStatus,
        },
        redis: {
          status: redisStatus,
        },
      },
      system: {
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        },
        loadAvg: os.loadavg(),
      },
      durationMs: Date.now() - startedAt,
    };
  }
}
