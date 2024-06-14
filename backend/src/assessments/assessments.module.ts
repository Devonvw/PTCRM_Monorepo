import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientGoalAchievement } from 'src/client-goal-achievement/entities/client-goal-achievement.entity';
import { ClientGoalsModule } from 'src/client-goals/client-goals.module';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { Assessment } from './entities/assessment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      ClientGoal,
      Measurement,
      ClientGoalAchievement,
    ]),
    ClientsModule,
    ClientGoalsModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
})
export class AssessmentsModule {}
