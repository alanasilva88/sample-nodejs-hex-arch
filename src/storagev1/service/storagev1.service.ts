import { Injectable, Logger } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import * as Handlebars from "handlebars";
import { ServiceException } from "../../common/exceptions/service.exception";
import { LogErrors } from "../../common/decorators/log-errors.decorator";
import { LogDbService } from "../../logdb/service/logdb.service";
import { GENERIC_ERROR_MESSAGES } from "../../common/constants/error-messages.constants";

@Injectable()
export class StorageV1Service {
  private readonly logger = new Logger(StorageV1Service.name);
  private readonly storage = new Storage();
  private readonly bucketName = process.env.BUCKET_NAME_HTML_TEMPLATES;

  constructor(public readonly logDbService: LogDbService) {}

  /**
   * Fetches an HTML template from Google Cloud Storage.
   * @param templateName - The name of the template file in the bucket.
   * @returns The template content as a string.
   */
  @LogErrors('StorageV1Service')
  async getTemplate(templateName: string): Promise<string> {
    this.logger.log(`Buscando template no bucket: ${this.bucketName}, objeto: ${templateName}`);
    try {
      const [file] = await this.storage
        .bucket(this.bucketName)
        .file(templateName)
        .download();

      this.logger.log(`Modelo obtido com sucesso: ${templateName}`);
      return file.toString();
    } catch (error: any) {
      this.logger.error(`Falha ao obter o modelo: ${templateName}`, error.stack);
      throw new ServiceException(GENERIC_ERROR_MESSAGES.SERVICE);
    }
  }

  /**
   * Compiles an HTML template using Handlebars.
   * @param templateContent - The raw HTML template content.
   * @param data - The data to be injected into the template.
   * @returns The compiled HTML string.
   */
  @LogErrors('StorageV1Service')
  compileTemplate(templateContent: string, data: Record<string, any>): string {
    try {
      const template = Handlebars.compile(templateContent);
      const compiledHtml = template(data);

      this.logger.log(`Modelo compilado com sucesso.`);
      return compiledHtml;
    } catch (error: any) {
      this.logger.error("Falha ao compilar o modelo", error.stack);
      throw new ServiceException(GENERIC_ERROR_MESSAGES.SERVICE);
    }
  }
}
