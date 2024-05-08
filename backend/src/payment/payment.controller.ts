import { Controller, Get, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request as ExpressRequest } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/my-subscriptions')
  async findAll(@Req() req: ExpressRequest) {
    return await this.paymentService.getSubscriptionsByUser(req.user.userId);
  }
}
