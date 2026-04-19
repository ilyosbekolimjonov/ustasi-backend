import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';
    const errorPayload = this.normalizeErrorPayload(errorResponse, status);

    const logMessage = `${request.method} ${request.url} ${status} ${errorPayload.message}`;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(logMessage);
    }

    response.status(status).json({
      statusCode: status,
      ...errorPayload,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private normalizeErrorPayload(errorResponse: unknown, status: number) {
    if (typeof errorResponse === 'string') {
      return {
        message: errorResponse,
        error: HttpStatus[status] ?? 'Error',
      };
    }

    if (errorResponse && typeof errorResponse === 'object') {
      const payload = errorResponse as Record<string, unknown>;
      const rawMessage = payload.message;
      const message = Array.isArray(rawMessage)
        ? rawMessage.filter((item) => typeof item === 'string').join(', ')
        : typeof rawMessage === 'string'
          ? rawMessage
          : 'Request failed';

      return {
        message,
        error:
          typeof payload.error === 'string'
            ? payload.error
            : HttpStatus[status] ?? 'Error',
        code: typeof payload.code === 'string' ? payload.code : undefined,
      };
    }

    return {
      message: 'Internal server error',
      error: HttpStatus[status] ?? 'Error',
    };
  }
}
