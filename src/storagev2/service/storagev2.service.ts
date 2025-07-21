import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { ServiceException } from '../../common/exceptions/service.exception';
import { LogErrors } from '../../common/decorators/log-errors.decorator';
import { LogDbService } from '../../logdb/service/logdb.service';

@Injectable()
export class StorageV2Service {
  private storage: Storage;
  private readonly logger = new Logger(StorageV2Service.name);

  constructor(public readonly logDbService: LogDbService) {
    this.storage = new Storage();
  }

  @LogErrors('StorageV2Service')
  async uploadFile(file: Express.Multer.File, bucketName: string, existingFileUrl?: string): Promise<string> {
    if (!file) {
      throw new ServiceException('Não foi fornecido nenhum arquivo.');
    }

    let fileName: string;

    // Se temos uma URL de arquivo existente e estamos atualizando, extraímos o nome do arquivo
    if (existingFileUrl) {
      try {
        // Tenta extrair o nome do arquivo da URL existente
        const existingFileName = existingFileUrl.split('/').pop();
        if (existingFileName) {
          fileName = existingFileName;
          this.logger.log(`Reutilizando nome de arquivo existente: ${fileName}`);
        } else {
          // Se falhar na extração, gera um novo nome
          fileName = this.generateFileName(file);
        }
      } catch (error) {
        // Se ocorrer um erro ao processar a URL, gera um novo nome
        this.logger.warn(`Erro ao extrair nome do arquivo existente: ${error}`);
        fileName = this.generateFileName(file);
      }
    } else {
      // Se não estamos atualizando, gera um novo nome
      fileName = this.generateFileName(file);
    }

    // const fileExtension = file.originalname.split('.').pop();
    // const fileName = `${uuidv4()}.${fileExtension}`;
    const bucket = this.storage.bucket(bucketName);
    const fileUpload = bucket.file(fileName);

    try {

      // Upload the file
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      // Make the file publicly accessible
      // await fileUpload.makePublic();

      // Return the public URL
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error: any) {
      this.logger.error(`Erro ao fazer upload do arquivo: ${error.message}`, error.stack);

      throw new ServiceException("Falha ao fazer upload do arquivo.");
    }

  }

  @LogErrors('StorageV2Service')
  async replaceFile(file: Express.Multer.File, bucketName: string, existingFileUrl: string): Promise<string> {
    if (!file) {
      throw new ServiceException('Nenhum novo arquivo foi fornecido para substituição.');
    }

    const fileName = this.extractFileNameFromUrl(existingFileUrl);
    if (!fileName) {
      throw new ServiceException('URL de arquivo existente inválida.');
    }

    const bucket = this.storage.bucket(bucketName);
    const fileUpload = bucket.file(fileName);

    try {
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      stream.end(file.buffer);

      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      this.logger.log(`Arquivo "${fileName}" substituído com sucesso no bucket "${bucketName}".`);
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error: any) {
      this.logger.error(`Erro ao substituir o arquivo: ${error.message}`, error.stack);
      throw new ServiceException("Falha ao substituir o arquivo.");
    }
  }

  @LogErrors('StorageV2Service')
  async deleteFile(bucketName: string, fileUrl: string): Promise<void> {
    const fileName = this.extractFileNameFromUrl(fileUrl);

    if (!fileName) {
      this.logger.warn(`Não foi possível extrair o nome do arquivo da URL: ${fileUrl}`);
      throw new ServiceException('URL de arquivo inválida.');
    }

    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        this.logger.warn(`Arquivo "${fileName}" não encontrado no bucket "${bucketName}".`);
        return;
      }

      await file.delete();
      this.logger.log(`Arquivo "${fileName}" excluído com sucesso do bucket "${bucketName}".`);
    } catch (error: any) {
      this.logger.error(`Erro ao excluir o arquivo: ${error.message}`, error.stack);
      throw new ServiceException("Falha ao excluir o arquivo.");
    }
  }

  private extractFileNameFromUrl(fileUrl: string): string | null {
    try {
      if (!fileUrl) return null;

      const parsedUrl = new URL(fileUrl);
      const pathname = parsedUrl.pathname;
      return pathname.split('/').pop() ?? null;
    } catch (e) {
      this.logger.warn(`Erro ao extrair nome do arquivo da URL: ${fileUrl}`);
      return null;
    }
  }

  // Método auxiliar para gerar um novo nome de arquivo
  private generateFileName(file: Express.Multer.File): string {
    const fileExtension = file.originalname.split('.').pop();
    return `${uuidv4()}.${fileExtension}`;
  }
}
