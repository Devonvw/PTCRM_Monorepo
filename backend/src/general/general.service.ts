import { Injectable } from '@nestjs/common';
import { Assessment } from 'src/assessments/entities/assessment.entity';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class GeneralService {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserDashboard(userId: number) {
    const clientCount = await this.entityManager.count(Client, {
      where: { user: { id: userId } },
    });
    const completedGoalsCount = await this.entityManager.count(ClientGoal, {
      where: { client: { user: { id: userId } }, completed: true },
    });
    const uncompletedGoalsCount = await this.entityManager.count(ClientGoal, {
      where: { client: { user: { id: userId } }, completed: false },
    });
    const assessmentCount = await this.entityManager.count(Assessment, {
      where: { client: { user: { id: userId } } },
    });

    return {
      clientCount,
      completedGoalsCount,
      uncompletedGoalsCount,
      assessmentCount,
    };
  }
}
