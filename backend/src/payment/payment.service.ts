import { Payment as MolliePayment, PaymentStatus } from '@mollie/api-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { InvoiceService } from 'src/invoice/invoice.service';
import { MailService } from 'src/mail/mail.service';
import { MollieService } from 'src/mollie/mollie.service';
import { EnumRoles } from 'src/types/roles.enums';
import { User } from 'src/users/entities/user.entity';
import {
  SUBSCRIPTION_INTERVAL_NUMBER,
  SUBSCRIPTION_INTERVAL_TYPE,
  VAT_PERCENTAGE,
} from 'src/utils/constants';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';
import Pagination from 'src/utils/pagination';
import { EntityManager, Repository } from 'typeorm';
import { GetPaymentsByUserQueryDto } from './dtos/GetPaymentsByUserQuery.dto';
import { MollieWebhookDto } from './dtos/MollieWebhook.dto';
import { Payment } from './entities/payment.entity';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private readonly entityManager: EntityManager,
    private mollieService: MollieService,
    private invoiceService: InvoiceService,
    private mailService: MailService,
  ) {}

  async getSubscriptions() {
    return this.subscriptionRepository.find();
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
    const invoice = await this.invoiceService.handleNewInvoice(payment, user);

    const pdf = await this.invoiceService.downloadInvoice(invoice.id, user.id);
    await this.mailService.sendUserInvoiceEmail(
      user?.email,
      invoice,
      pdf?.buffer,
    );

    return molliePayment._links.checkout.href;
  }

  async mollieWebhook(body: MollieWebhookDto) {
    const molliePayment = await this.mollieService.getPayment(body?.id);
    let payment = await this.entityManager.findOne(Payment, {
      where: { molliePaymentId: body?.id },
      relations: ['subscription', 'user'],
    });

    // Check if payment is a subscription payment and if the payment is already in the database
    if (molliePayment?.subscriptionId && !payment) {
      payment = await this.handleNewSubscriptionPayment(molliePayment);
    }

    // Check if payment is a subscription payment and if the payment is paid
    if (
      molliePayment?.subscriptionId &&
      molliePayment?.status == PaymentStatus.paid
    ) {
      await this.handlePaymentPaid(payment);
      payment.paidAt = new Date();
    }

    if (
      !molliePayment?.subscriptionId &&
      molliePayment?.status == PaymentStatus.paid
    ) {
      await this.handleMandateFulfilled(payment.user.id, payment);
      payment.paidAt = new Date();
    }

    payment.status = molliePayment.status;
    this.entityManager.save(payment);
  }

  async handleNewSubscriptionPayment(molliePayment: MolliePayment) {
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
      status: molliePayment.status,
    });

    return await this.entityManager.save(payment);
  }

  async handlePaymentPaid(payment: Payment) {
    const invoice = await this.invoiceService.handleNewInvoice(
      payment,
      payment?.user,
    );
    const pdf = await this.invoiceService.downloadInvoice(
      invoice.id,
      payment?.user.id,
    );
    await this.mailService.sendUserInvoiceEmail(
      payment?.user?.email,
      invoice,
      pdf?.buffer,
    );
  }

  async handleMandateFulfilled(userId: number, payment: Payment) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
      relations: ['subscription'],
    });

    user.hasMandate = true;
    await this.entityManager.save(user);

    const mandate = await this.mollieService.getMandates(user.mollieCustomerId);

    if (!mandate?.length) return;

    const startDate = dayjs()
      .add(SUBSCRIPTION_INTERVAL_NUMBER, SUBSCRIPTION_INTERVAL_TYPE)
      .format('YYYY-MM-DD');

    await this.mollieService.createSubscription(
      payment.user.mollieCustomerId,
      mandate?.[0].id,
      startDate,
      payment.subscription.totalPrice,
      `Payment for subscription:${payment.subscription.name}`,
    );
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
