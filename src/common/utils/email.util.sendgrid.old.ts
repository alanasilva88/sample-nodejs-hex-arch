import { Injectable, Logger } from "@nestjs/common";
import sgMail from '@sendgrid/mail';
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class EmailUtil {
  private readonly logger = new Logger(EmailUtil.name);

  constructor() {
    sgMail.setApiKey(process.env.FSF_SENDGRID_API_KEY);  // Sua API KEY do SendGrid
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    const msg: any = {
      to,
      from: 'noreply@fullstackfy.com',
      subject,
    };

    // Só adiciona text se não estiver vazio
    if (text && text.trim()) {
      msg.text = text;
    }

    // Só adiciona html se não estiver vazio
    if (html && html.trim()) {
      msg.html = html;
    }

    try {
      await sgMail.send(msg);
      this.logger.log(`Email enviado com sucesso para ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Erro ao enviar email: ${error.toString()}`);
      if (error.response && error.response.body) {
        this.logger.error(`Detalhe do erro: ${JSON.stringify(error.response.body)}`);
      }
      return false;
    }
  }

}
