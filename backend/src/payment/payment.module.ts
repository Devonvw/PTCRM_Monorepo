import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { MollieService } from 'src/mollie/mollie.service';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Subscription, User]),
    InvoiceModule,
  ],
  providers: [PaymentService, MollieService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
