import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { ClientsService } from 'src/clients/clients.service';
import { Assessment } from './entities/assessment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, ClientGoal]), ClientsModule],
  controllers: [AssessmentsController],
  providers: [AssessmentsService]
})
export class AssessmentsModule {}
