import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendMessage(text: string) {
    if (!this.token || !this.chatId) {
      return;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text,
            parse_mode: 'HTML',
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(`Telegram message failed: ${response.status} ${errorText}`);
      }
    } catch (error) {
      this.logger.warn(
        `Telegram message failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }
}
