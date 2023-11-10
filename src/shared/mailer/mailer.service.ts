import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}
  public resend = new Resend(this.configService.get<string>('RESEND_KEY'));
  async sendMail(options: any) {
    try {
      const data = await this.resend.emails.send({
        from: 'Square CRM <noreply@audstack.com>',
        to: [options.email],
        subject: options.subject,
        html: options.html,
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

}
