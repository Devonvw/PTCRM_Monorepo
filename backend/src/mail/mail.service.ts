import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserInvoiceEmail(
    email: string,
    invoice: Invoice,
    invoicePdf: Buffer,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Invoice #${invoice.number}`,
      template: 'user-invoice',
      context: {
        invoiceNumber: invoice.number,
        name: invoice.user.company,
      },
      attachments: [
        {
          filename: `Invoice #${invoice.number}.pdf`,
          content: invoicePdf,
        },
      ],
    });
  }
}
