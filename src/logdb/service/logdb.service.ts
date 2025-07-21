import { Injectable, Logger } from '@nestjs/common';
import { ServiceException } from '../../common/exceptions/service.exception';
import { DataAccessException } from '../../common/exceptions/data-access.exception';
import { LogDbEntity } from '../entity/logDbEntity';
import { LogDbRepository } from '../repository/logdb.repository';

@Injectable()
export class LogDbService {
  private readonly logger = new Logger(LogDbService.name);

  constructor(private readonly logDbRepository: LogDbRepository) { }

  async logError(
    error: any,
    method: string,
    params?: any,
    context?: string,
  ): Promise<void> {
    const sanitizedParams = Array.isArray(params)
      ? params.filter((p) => p !== undefined)
      : params;

    const log: LogDbEntity = {
      timestamp: new Date(),
      message: error?.message || 'Erro desconhecido',
      stack: error?.stack || 'Sem stack',
      method,
      params: sanitizedParams,
      context,
    };

    this.logger.error(`[${context || 'fullstackfy-back'}] ${log.message}`, log.stack);

    try {
      await this.logDbRepository.create(log);
    } catch (error: any) {
      this.logger.error('Erro ao criar log db:', error);

      if (error instanceof DataAccessException) {
        throw new ServiceException(error.message);
      }

      throw new ServiceException('Falha ao criar a log db');
    }
  }

}