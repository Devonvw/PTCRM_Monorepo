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
// import { AuthenticatedGuard } from './guards/authenticated.guard';
import { MailModule } from './mail/mail.module';
import { ClientGoalAchievementModule } from './client-goal-achievement/client-goal-achievement.module';
import { MollieService } from './mollie/mollie.service';
import { AssessmentsModule } from './assessments/assessments.module';
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    MailModule,
    UsersModule,
    ClientsModule,
    PaymentModule,
    AuthModule,
    GoalsModule,
    ClientGoalsModule,
    ClientGoalAchievementModule,
    AssessmentsModule,
    MeasurementsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MollieService],
})
export class AppModule {}
