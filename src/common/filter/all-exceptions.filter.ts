import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Logger } from "winston";
import { DataAccessException } from "../exceptions/data-access.exception";
import { ServiceException } from "../exceptions/service.exception";
import { GENERIC_ERROR_MESSAGES } from "../constants/error-messages.constants";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = GENERIC_ERROR_MESSAGES.DEFAULT;

    if (exception instanceof DataAccessException) {
      message = exception.message || GENERIC_ERROR_MESSAGES.DATABASE;
    } else if (exception instanceof ServiceException) {
      message = exception.message || GENERIC_ERROR_MESSAGES.SERVICE;
    }

    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
