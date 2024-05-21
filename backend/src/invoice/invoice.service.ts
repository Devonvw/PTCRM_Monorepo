import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from 'src/payment/entities/payment.entity';
import { EntityManager } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/users/entities/user.entity';
import invoicePDF from 'src/utils/pdf/userInvoice';
import { DownloadDto } from 'src/utils/dto/download.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly entityManager: EntityManager) {}

  async handleNewInvoice(payment: Payment, user: User) {
    const latestNumberInvoice = await this.entityManager
      .createQueryBuilder(Invoice, 'invoice')
      .select('MAX(invoice.number)', 'max')
      .getRawOne();

    const invoice = new Invoice({
      user: user,
      payment: payment,
      number: +(latestNumberInvoice.max || 0) + 1,
    });

    return await this.entityManager.save(invoice);
  }

  async downloadInvoice(
    invoiceId: number,
    userId: number,
  ): Promise<DownloadDto> {
    const invoice = await this.entityManager.findOne(Invoice, {
      where: { id: invoiceId, user: { id: userId } },
      relations: ['payment', 'user'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const pdf = await invoicePDF(invoice);

    const name = `Invoice #${invoice?.number} - ${invoice?.user?.company}`;

    return {
      buffer: pdf,
      name,
      mimeType: 'application/pdf',
    };
  }
}
