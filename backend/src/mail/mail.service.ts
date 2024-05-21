import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendClientSignupEmail(
    email: string,
    company: string,
    client: Partial<Client>,
    token: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Sign up with ${company}`,
      template: 'client-signup',
      context: {
        token,
        client,
        company,
      },
    });
  }

  async sendUserInvoiceEmail(email: string, invoice: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Invoice #${invoice.number}`,
      template: 'user-invoice',
      context: {
        invoiceNumber: invoice.number,
        name: invoice.user.company,
      },
    });
  }
}
