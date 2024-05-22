import { Module } from '@nestjs/common';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Assessment } from 'src/assessments/entities/assessment.entity';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Goal, ClientGoal, Assessment])],
  providers: [GeneralService],
  controllers: [GeneralController],
  exports: [GeneralService],
})
export class GeneralModule {}
