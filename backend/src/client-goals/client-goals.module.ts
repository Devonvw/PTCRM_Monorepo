import { Module } from '@nestjs/common';
import { ClientGoalsController } from './client-goals.controller';
import { ClientGoalsService } from './client-goals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientGoal } from './entities/client-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientGoal])],
  controllers: [ClientGoalsController],
  providers: [ClientGoalsService]
})
export class ClientGoalsModule {}
