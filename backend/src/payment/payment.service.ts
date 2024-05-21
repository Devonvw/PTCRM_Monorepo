import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { MollieService } from 'src/mollie/mollie.service';
import dayjs from 'dayjs';
import { EnumRoles } from 'src/types/roles.enums';
import { MollieWebhookDto } from './dtos/MollieWebhook.dto';
import { Payment as MolliePayment } from '@mollie/api-client';
import { GetPaymentsByUserQueryDto } from './dtos/GetPaymentsByUserQuery.dto';
import Pagination from 'src/utils/pagination';
import OrderBy from 'src/utils/order-by';
import Filters from 'src/utils/filter';
import invoicePDF from 'src/utils/pdf/userInvoice';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { InvoiceService } from 'src/invoice/invoice.service';

const VAT_PERCENTAGE = 0.21;

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private readonly entityManager: EntityManager,
    private mollieService: MollieService,
    private invoiceService: InvoiceService,
  ) {}

  async getSubscriptions() {
    return this.subscriptionRepository.find({});
  }

  async getPaymentsByUser(
    query: GetPaymentsByUserQueryDto,
    userId: number,
    loggedInUserId: number,
  ) {
    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'date',
        fields: ['date'],
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

    const clients = await this.paymentRepository.find({
      ...pagination,
      where: [...filter],
      relations: ['subscription', 'invoice'],
      order: orderBy,
    });

    const totalRows = await this.paymentRepository.count({
      where: [...filter],
    });

    return { data: clients, totalRows };
  }

  async updateUserSubscription(subscriptionId: number, userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });
  }

  async updateInitialUserSubscription(
    subscriptionId: number,
    userId: number,
  ): Promise<string> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist.');

    const subscription = await this.entityManager.findOne(Subscription, {
      where: { id: subscriptionId },
    });

    user.subscription = subscription;
    // user.mollieCustomerId = 'cst_kfrURgsd4c';

    if (!subscription)
      throw new NotFoundException('Subscription does not exist.');

    if (!user.mollieCustomerId) {
      const customerId = await this.mollieService.createCustomer(
        `${user.firstname} ${user.lastname}`,
        user.email,
      );

      user.mollieCustomerId = customerId;
    }

    await this.entityManager.save(user);

    const molliePayment = await this.mollieService.createFirstPayment(
      user.mollieCustomerId,
      subscription.totalPrice,
      `Verification for subscription:${subscription.name}`,
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const payment = new Payment({
      date: today,
      price: subscription.price,
      vatPrice: subscription.vatPrice,
      totalPrice: subscription.totalPrice,
      molliePaymentId: molliePayment.id,
      molliePaymentUrl: molliePayment._links.checkout.href,
      isVerification: true,
      subscription: subscription,
      user: user,
    });

    await this.entityManager.save(subscription);
    await this.entityManager.save(payment);
    await this.invoiceService.handleNewInvoice(payment, user);

    return molliePayment._links.checkout.href;
  }

  async createPayment(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
      relations: ['subscription'],
    });

    const latestPayment = await this.entityManager.findOne(Payment, {
      where: { subscription: { id: user.subscription.id } },
      order: { date: 'DESC' },
    });

    const today = dayjs();

    if (today.diff(dayjs(latestPayment.date), 'day') >= 28) return;

    const molliePayment = await this.mollieService.createRecurringPayment(
      user.mollieCustomerId,
      user.subscription.totalPrice,
      `Payment for subscription:${user.subscription.name} ()`,
    );

    today.hour(0).minute(0).second(0).millisecond(0);

    const payment = new Payment({
      date: today.toDate(),
      price: user.subscription.price,
      vatPrice: user.subscription.vatPrice,
      totalPrice: user.subscription.totalPrice,
      molliePaymentId: molliePayment.id,
      subscription: user.subscription,
      user: user,
    });

    await this.entityManager.save(payment);
  }

  async mollieWebhook(body: MollieWebhookDto) {
    const molliePayment = await this.mollieService.getPayment(body?.id);
    const payment = await this.entityManager.findOne(Payment, {
      where: { molliePaymentId: body?.id },
      relations: ['subscription', 'user'],
    });

    console.log('molliePayment', molliePayment);
    console.log('payment', payment);
    console.log('\n\n');

    switch (molliePayment?.status) {
      case 'paid':
        if (molliePayment?.subscriptionId)
          await this.handleSubscriptionPayment(molliePayment);
        else await this.handleMandateFullfilled(payment.user.id, payment);
        break;
      case 'canceled':
      case 'expired':
      case 'failed':
        break;
    }
  }

  async handleSubscriptionPayment(molliePayment: MolliePayment) {
    const user = await this.entityManager.findOne(User, {
      where: { mollieCustomerId: molliePayment.customerId },
      relations: ['subscription'],
    });

    const price = Number(molliePayment.amount.value);
    const payment = new Payment({
      date: new Date(),
      price: price - price * VAT_PERCENTAGE,
      vatPrice: price * VAT_PERCENTAGE,
      totalPrice: price,
      molliePaymentId: molliePayment.id,
      subscription: user.subscription,
      user: user,
    });

    await this.entityManager.save(payment);

    await this.invoiceService.handleNewInvoice(payment, user);
  }

  async handleMandateFullfilled(userId: number, payment: Payment) {
    payment.paid = true;
    payment.paidAt = new Date();
    await this.entityManager.save(payment);

    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
      relations: ['subscription'],
    });

    user.hasMandate = true;
    await this.entityManager.save(user);

    const mandate = await this.mollieService.getMandates(user.mollieCustomerId);

    if (!mandate?.length) return;

    this.mollieService.createSubscription(
      payment.user.mollieCustomerId,
      mandate?.[0].id,
      dayjs().add(4, 'week').format('YYYY-MM-DD'),
      payment.subscription.totalPrice,
      `Payment for subscription:${payment.subscription.name}`,
    );
  }

  async handleTodaysPayments() {
    const users = await this.entityManager.find(User, {
      where: { role: EnumRoles.USER, subscription: Not(null) },
      relations: ['subscription'],
    });

    users.forEach(async (user) => {
      const latestPayment = await this.entityManager.findOne(Payment, {
        where: { subscription: { id: user.subscription.id } },
        order: { date: 'DESC' },
      });

      const today = dayjs();

      if (today.diff(dayjs(latestPayment.date), 'day') >= 28) {
        await this.createPayment(user.id);
        //TODO: Create invoice
        //TODO: Send email
      }
    });
  }

  async getUserMandateStatus(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist.');

    const payment = await this.entityManager.findOne(Payment, {
      where: { user: { id: userId }, isVerification: true },
    });

    return {
      hasMandate: user.hasMandate,
      paymentUrl: payment?.molliePaymentUrl,
    };
  }
}
