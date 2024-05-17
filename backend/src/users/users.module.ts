import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { Subscription } from 'src/payment/entities/subscription.entity';
import { Invoice } from 'src/payment/entities/invoice.entity';
import { MollieService } from 'src/mollie/mollie.service';
import { PaymentModule } from 'src/payment/payment.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    PaymentModule,
    TypeOrmModule.forFeature([User, Payment, Subscription, Invoice]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
