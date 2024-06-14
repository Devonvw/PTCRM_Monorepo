import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from 'src/payment/entities/payment.entity';
import { EntityManager } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/users/entities/user.entity';
import invoicePDF from 'src/utils/pdf/userInvoice';
import { DownloadDto } from 'src/utils/dto/download.dto';
import { GetInvoicesByUserQueryDto } from './dtos/GetInvoicesByUserQuery.dto';
import Pagination from 'src/utils/pagination';
import OrderBy from 'src/utils/order-by';
import { EnumRoles } from 'src/types/roles.enums';
import Filters from 'src/utils/filter';

@Injectable()
export class InvoiceService {
  constructor(private readonly entityManager: EntityManager) {}

  async handleNewInvoice(payment: Payment, user: User) {
    const latestNumberInvoice = await this.entityManager
      .createQueryBuilder(Invoice, 'invoice')
      .select('MAX(invoice.number)', 'max')
      .getRawOne<{ max: number }>();

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
      relations: {
        payment: {
          subscription: true,
        },
        user: true,
      },
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

  async getInvoicesByUser(
    query: GetInvoicesByUserQueryDto,
    userId: number,
    loggedInUserId: number,
  ) {
    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'date',
        fields: ['date'],
        relations: ['payment'],
      },
    ]);

    const loggedInUser = await this.entityManager.findOne(User, {
      where: { id: loggedInUserId },
    });

    userId = loggedInUser.role === EnumRoles.USER ? loggedInUserId : userId;

    const filter = Filters(null, [
      {
        condition: true,
        filter: {
          user: { id: userId },
        },
      },
    ]);

    const data = await this.entityManager.find(Invoice, {
      ...pagination,
      where: [...filter],
      relations: {
        payment: true,
      },
      order: orderBy,
    });

    const totalRows = await this.entityManager.count(Invoice, {
      where: [...filter],
    });

    return { data, totalRows };
  }
}
