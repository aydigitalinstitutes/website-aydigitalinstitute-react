import { Injectable } from '@nestjs/common';
import client from 'prom-client';

@Injectable()
export class MetricsService {
  private initialized = false;

  private init(): void {
    if (this.initialized) {
      return;
    }
    client.collectDefaultMetrics();
    this.initialized = true;
  }

  contentType(): string {
    this.init();
    return client.register.contentType;
  }

  async metrics(): Promise<string> {
    this.init();
    return client.register.metrics();
  }
}
