// src/common/utils/error.util.ts
import { Logger } from '@nestjs/common';
import { ServiceException } from '../exceptions/service.exception';
import { DataAccessException } from '../exceptions/data-access.exception';
import { GENERIC_ERROR_MESSAGES } from '../constants/error-messages.constants';

export class ErrorUtil{
  private static readonly logger = new Logger('ErrorHandler');

  static handleError(error: unknown, context: string): never {
    this.logger.error(`Error em: ${context}`, error);

    if (error instanceof DataAccessException) {
      // Retorna a mensagem exata do repositório
      throw new ServiceException(error.message);
    }

    if (error instanceof Error) {
      // Preserva a mensagem do erro genérico
      throw new ServiceException(error.message);
    }

    throw new ServiceException(GENERIC_ERROR_MESSAGES.SERVICE);
  }
}