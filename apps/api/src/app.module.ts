import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { initSentry } from './shared/sentry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';

        return {
          transports: [
            new winston.transports.Console({
              format:
                nodeEnv === 'production'
                  ? winston.format.combine(
                      winston.format.timestamp(),
                      winston.format.json(),
                    )
                  : winston.format.combine(
                      winston.format.colorize(),
                      winston.format.timestamp(),
                      winston.format.printf((info) => {
                        const timestamp =
                          typeof info.timestamp === 'string'
                            ? info.timestamp
                            : new Date().toISOString();
                        const level =
                          typeof info.level === 'string'
                            ? info.level
                            : String(info.level);
                        const message =
                          typeof info.message === 'string'
                            ? info.message
                            : String(info.message);
                        const meta = info.meta ? JSON.stringify(info.meta) : '';
                        return `${timestamp} ${level}: ${message}${meta ? ` ${meta}` : ''}`;
                      }),
                    ),
            }),
          ],
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    AdminModule,
    HealthModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(config: ConfigService) {
    initSentry(config);
  }
}
