import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getClientDashboard(clientId: number, byUserId: number) {
    const client = await this.entityManager.findOne(Client, {
      where: { user: { id: byUserId } },
    });

    if (!client) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    const clientGoalsCount = await this.entityManager.count(ClientGoal, {
      where: { client: { id: clientId } },
    });

    const completedGoalsCount = await this.entityManager.count(ClientGoal, {
      where: { client: { id: clientId }, completed: true },
    });

    const uncompletedGoalsCount = await this.entityManager.count(ClientGoal, {
      where: { client: { id: clientId }, completed: false },
    });

    const clientAssessmentsCount = await this.entityManager.count(Assessment, {
      where: { client: { id: clientId } },
    });

    return {
      clientGoalsCount,
      completedGoalsCount,
      uncompletedGoalsCount,
      clientAssessmentsCount,
    };
  }
}
