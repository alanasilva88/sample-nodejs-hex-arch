import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

dotenv.config();

@Injectable()
export class EmailUtil {
  private readonly logger = new Logger(EmailUtil.name);
  private readonly mg;
  private readonly domain: string;

  constructor() {
    const mailgun = new Mailgun(FormData);
    const apiKey = process.env.FSF_MAILGUN_API_KEY;
    const domain = process.env.FSF_MAILGUN_DOMAIN;

    if (!apiKey || !domain) {
      throw new Error('Chave da API ou domínio do Mailgun não configurado no ambiente.');
    }

    this.mg = mailgun.client({
      username: 'api',
      key: apiKey,
    });

    this.domain = domain;
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    const messageData: any = {
      from: `FullStackFy <noreply@${this.domain}>`,
      to,
      subject,
    };

    if (text && text.trim()) {
      messageData.text = text;
    }

    if (html && html.trim()) {
      messageData.html = html;
    }

    try {
      await this.mg.messages.create(this.domain, messageData);
      this.logger.log(`Email enviado com sucesso para ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Erro ao enviar email: ${error.message || error.toString()}`);
      if (error.response && error.response.body) {
        this.logger.error(`Detalhe do erro: ${JSON.stringify(error.response.body)}`);
      }
      return false;
    }
  }
}
