import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly redis: RedisService) {}

  private key(userId: string, tokenId: string): string {
    return `refresh:${userId}:${tokenId}`;
  }

  async store(userId: string, tokenId: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.key(userId, tokenId), '1', ttlSeconds);
  }

  async exists(userId: string, tokenId: string): Promise<boolean> {
    const value = await this.redis.get(this.key(userId, tokenId));
    return value === '1';
  }

  async revoke(userId: string, tokenId: string): Promise<void> {
    await this.redis.del(this.key(userId, tokenId));
  }
}

