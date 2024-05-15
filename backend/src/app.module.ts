import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientGoalsModule } from './client-goals/client-goals.module';
import { ClientsModule } from './clients/clients.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { GoalsModule } from './goals/goals.module';
import { PaymentModule } from './payment/payment.module';
import { UsersModule } from './users/users.module';
// import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AssessmentsModule } from './assessments/assessments.module';
import { ClientGoalAchievementModule } from './client-goal-achievement/client-goal-achievement.module';
import { MailModule } from './mail/mail.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { MollieService } from './mollie/mollie.service';

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
