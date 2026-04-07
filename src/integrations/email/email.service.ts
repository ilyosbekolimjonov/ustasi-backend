import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AppConfig } from '../../config/app.config';
import { EmailConfig } from '../../config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter;
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
      `/api/auth/verify-email?token=${token}`,
      this.appConfig.appBaseUrl,
    ).toString();

    await this.transporter.sendMail({
      from: this.emailConfig.from,
      to: email,
      subject: 'Verify your Ustasi account',
      html: `
        <p>Welcome to Ustasi.</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    this.logger.log(`Verification email queued for ${email}`);
  }
}
