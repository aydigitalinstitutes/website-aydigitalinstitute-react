import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpResponse = isHttp ? exception.getResponse() : undefined;
    const message =
      typeof httpResponse === 'string'
        ? httpResponse
        : (httpResponse as any)?.message ?? (exception as any)?.message ?? 'Internal server error';

    const details =
      typeof httpResponse === 'object' && httpResponse
        ? (httpResponse as any)
        : undefined;

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        path: request.originalUrl,
        timestamp: new Date().toISOString(),
        details,
      },
    });
  }
}

