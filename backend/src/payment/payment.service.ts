import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private readonly entityManager: EntityManager,
  ) {}

  async getSubscriptionsByUser(userId: number) {
    return this.subscriptionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
