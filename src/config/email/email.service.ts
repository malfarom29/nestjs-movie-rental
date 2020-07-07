import { Injectable, Logger } from '@nestjs/common';
import { transporter } from './nodemailer.config';

@Injectable()
export class EmailService {
  constructor(private logger: Logger) {}

  async sendEmail(
    emailReceiver: string,
    subject: string,
    body: string,
  ): Promise<void> {
    try {
      await transporter.sendMail({
        from: 'noreply@movierental.com',
        to: emailReceiver,
        subject,
        html: body,
      });
      this.logger.verbose(`Email successfully sent to: ${emailReceiver}`);
    } catch (error) {
      this.logger.error(error.stack);
    }
  }
}
