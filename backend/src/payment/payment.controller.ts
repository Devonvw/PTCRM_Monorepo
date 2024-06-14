import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request as ExpressRequest } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { MollieWebhookDto } from './dtos/MollieWebhook.dto';
import { GetPaymentsByUserQueryDto } from './dtos/GetPaymentsByUserQuery.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRoles } from 'src/types/roles.enums';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('/subscriptions')
  async findAll(@Req() req: ExpressRequest) {
    return await this.paymentService.getSubscriptions();
  }

  @Get('/user-status')
  async getUserMandateStatus(@Req() req: ExpressRequest) {
    return await this.paymentService.getUserMandateStatus(req.user.id);
  }

  @Roles([EnumRoles.USER])
  @Get('/my-payments')
  async getPaymentsByMe(
    @Query() query: GetPaymentsByUserQueryDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.paymentService.getPaymentsByUser(
      query,
      req.user.id,
      req.user.id,
    );
  }

  @Roles([EnumRoles.ADMIN])
  @Get('/user/:id')
  async getPaymentsByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetPaymentsByUserQueryDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.paymentService.getPaymentsByUser(query, id, req.user.id);
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
