import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request as ExpressRequest } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { MollieWebhookDto } from './dtos/MollieWebhook.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('/subscriptions')
  async findAll(@Req() req: ExpressRequest) {
    return await this.paymentService.getSubscriptions();
  }

  @Public()
  @Post('/webhook-mollie')
  async mollieWebhook(
    @Req() req: ExpressRequest,
    @Body() body: MollieWebhookDto,
  ) {
    return await this.paymentService.mollieWebhook(body);
  }
}
