import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AppConfig } from '../../config/app.config';
import { EmailConfig } from '../../config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly emailConfig: EmailConfig;
  private readonly appConfig: AppConfig;

  constructor(private readonly configService: ConfigService) {
    this.emailConfig = this.configService.getOrThrow<EmailConfig>('email');
    this.appConfig = this.configService.getOrThrow<AppConfig>('app');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.emailConfig.user,
        pass: this.emailConfig.pass,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = new URL(
      `/auth/verify-email?token=${token}`,
      this.appConfig.appBaseUrl,
    ).toString();

    await this.transporter.sendMail({
      from: this.emailConfig.from,
      to: email,
      subject: 'Ustasi emailingizni tasdiqlang',
      html: `
        <p>Ustasi'ga xush kelibsiz.</p>
        <p>Email manzilingizni tasdiqlash uchun quyidagi havolani bosing:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>Havola 24 soat davomida amal qiladi.</p>
      `,
    });

    this.logger.log(`Verification email queued for ${email}`);
  }
}
