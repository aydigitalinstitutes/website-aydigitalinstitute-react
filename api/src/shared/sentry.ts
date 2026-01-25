import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

export const initSentry = (config: ConfigService): void => {
  const dsn = config.get<string>('SENTRY_DSN');
  const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: nodeEnv,
    tracesSampleRate: nodeEnv === 'production' ? 0.1 : 1,
  });
};

