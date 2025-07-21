import { Injectable, Logger } from '@nestjs/common';
import { FirebaseAdminProvider } from '../../firebase/firebaseadmin.provider';
import { DataAccessException } from '../../common/exceptions/data-access.exception';
import { LogDbEntity } from '../entity/logDbEntity';

@Injectable()
export class LogDbRepository {
  private readonly logger = new Logger(LogDbRepository.name);

  constructor(private readonly firebaseAdminProvider: FirebaseAdminProvider) {}

  async create(logDbData: LogDbEntity): Promise<string> {
    try {
      const db = this.firebaseAdminProvider.getFirestore();
      const sanitizedData = this.removeUndefinedDeep(logDbData);

      const logDbRef = await db.collection('logsdb').add(sanitizedData);
      return logDbRef.id;
    } catch (error) {
      this.logger.error('Erro no repositório ao criar log db', error);
      throw new DataAccessException('Falha ao criar log db.');
    }
  }

  /**
   * Remove undefined de arrays e objetos, inclusive aninhados
   */
  private removeUndefinedDeep(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .filter((item) => item !== undefined)
        .map((item) => this.removeUndefinedDeep(item));
    } else if (obj !== null && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          result[key] = this.removeUndefinedDeep(value);
        }
      }
      return result;
    }
    return obj;
  }
}
