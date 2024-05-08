import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Client } from './clients/entities/client.entity';
import { User } from './users/entities/user.entity';
import { DatabaseModule } from './database/database.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { SessionEntity } from './domain/session.entity';
import { GoalsModule } from './goals/goals.module';
import { ClientGoalsModule } from './client-goals/client-goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ClientsModule,
    PaymentModule,
    AuthModule,
    GoalsModule,
    ClientGoalsModule,
  ],
  controllers: [AppController],
  providers: [AppService]

})
export class AppModule {}
