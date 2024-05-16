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

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private readonly entityManager: EntityManager,
    private mollieService: MollieService,
  ) {}

  async getSubscriptions() {
    return this.subscriptionRepository.find({});
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
    user.mollieCustomerId = 'cst_kfrURgsd4c';

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
      subscription: subscription,
      user: user,
    });

    await this.entityManager.save(subscription);
    await this.entityManager.save(payment);

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

    switch (molliePayment?.status) {
      case 'paid':
        payment.paid = true;
        payment.paidAt = new Date();
        await this.entityManager.save(payment);
        console.log(payment, payment?.user);
        this.mollieService.createSubscription(
          payment.user.mollieCustomerId,
          payment.subscription.totalPrice,
          `Payment for subscription:${payment.subscription.name}`,
        );
        break;
      case 'canceled':
      case 'expired':
      case 'failed':
        break;
    }
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
}
