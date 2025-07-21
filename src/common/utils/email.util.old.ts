import * as nodemailer from "nodemailer";
import { Injectable, Logger } from "@nestjs/common";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class EmailUtilOld {
  private readonly logger = new Logger(EmailUtilOld.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: "apikey", // Fixo para SendGrid SMTP
        pass: process.env.FSF_SENDGRID_API_KEY, // Sua API Key do SendGrid
      },
      logger: true,
      debug: true,
    });
  }

  /**
   * Envia um e-mail com suporte a conteúdo HTML.
   * Aceita tanto string quanto Promise<string> como valor de HTML.
   */
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string | Promise<string>
  ): Promise<boolean> {
    try {
      const resolvedHtml = html ? await html : undefined;

      await this.transporter.sendMail({
        from: '"FullStackFy" <noreply@fullstackfy.com>',
        to,
        subject,
        text,
        html: resolvedHtml,
      });

      this.logger.log(`E-mail enviado com sucesso para ${to}`);
      return true;
    } catch (error) {
      this.logger.error("Erro ao enviar o e-mail: ", JSON.stringify(error));
      return false;
    }
  }
}
