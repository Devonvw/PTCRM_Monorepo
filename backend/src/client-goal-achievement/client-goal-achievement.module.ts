import { Module } from '@nestjs/common';
import { ClientGoalAchievementController } from './client-goal-achievement.controller';
import { ClientGoalAchievementService } from './client-goal-achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientGoalAchievement } from './entities/client-goal-achievement.entity';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientGoalAchievement, ClientGoal, Client])],
  controllers: [ClientGoalAchievementController],
  providers: [ClientGoalAchievementService]
})
export class ClientGoalAchievementModule {}
