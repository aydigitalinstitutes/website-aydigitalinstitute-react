import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis | null = null;
  private readonly memoryStore = new Map<string, { value: string; expiry: number | null }>();
  private readonly logger = new Logger(RedisService.name);
  private useMemory = false;

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL');
    
    // If no URL provided or explicitly set to memory, use memory store
    if (!url || url === 'memory' || url.includes('localhost')) {
      this.logger.warn('Using in-memory Redis mock due to configuration or localhost default.');
      this.useMemory = true;
      // We still define client as null or mock if needed, but we'll bypass it.
      return;
    }

    try {
      this.client = new Redis(url, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times) => {
           if (times > 3) {
             this.logger.warn('Redis connection failed too many times. Switching to in-memory store.');
             this.useMemory = true;
             return null; // Stop retrying
           }
           return Math.min(times * 50, 2000);
        }
      });

      this.client.on('error', (err) => {
        this.logger.error(`Redis error: ${err.message}`);
        this.useMemory = true;
      });
    } catch (e) {
      this.logger.error('Failed to initialize Redis client, using memory store.');
      this.useMemory = true;
    }
  }

  // Helper to check expiry
  private isExpired(key: string): boolean {
    const item = this.memoryStore.get(key);
    if (!item) return true;
    if (item.expiry && Date.now() > item.expiry) {
      this.memoryStore.delete(key);
      return true;
    }
    return false;
  }

  async ping(): Promise<string> {
    if (this.useMemory || !this.client) return 'PONG';
    return this.client.ping();
  }

  async get(key: string): Promise<string | null> {
    if (this.useMemory || !this.client) {
      if (this.isExpired(key)) return null;
      return this.memoryStore.get(key)?.value ?? null;
    }
    try {
      return await this.client.get(key);
    } catch (e) {
        this.useMemory = true;
        if (this.isExpired(key)) return null;
        return this.memoryStore.get(key)?.value ?? null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.useMemory || !this.client) {
      const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
      this.memoryStore.set(key, { value, expiry });
      return;
    }
    try {
        if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
        await this.client.set(key, value);
        }
    } catch (e) {
        this.useMemory = true;
        const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        this.memoryStore.set(key, { value, expiry });
    }
  }

  async del(key: string): Promise<void> {
    if (this.useMemory || !this.client) {
      this.memoryStore.delete(key);
      return;
    }
    try {
        await this.client.del(key);
    } catch (e) {
        this.useMemory = true;
        this.memoryStore.delete(key);
    }
  }
}
