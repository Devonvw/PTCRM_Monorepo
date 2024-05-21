import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { ClientGoalsController } from './client-goals.controller';
import { ClientGoalsService } from './client-goals.service';
import { ClientGoal } from './entities/client-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientGoal, Client, Goal])],
  controllers: [ClientGoalsController],
  providers: [ClientGoalsService],
  exports: [ClientGoalsService],
})
export class ClientGoalsModule {}
