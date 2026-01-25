import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 5001;
  const corsOriginsRaw = config.get<string>('CORS_ORIGINS') ?? '';
  const corsOrigins = corsOriginsRaw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'metrics', method: RequestMethod.GET },
    ],
  });
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(port);
}

bootstrap();
