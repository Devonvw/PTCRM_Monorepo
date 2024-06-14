import { Injectable, NotFoundException } from '@nestjs/common';
import { Assessment } from 'src/assessments/entities/assessment.entity';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { Client } from 'src/clients/entities/client.entity';
import { EntityManager } from 'typeorm';
import { UserDashboardDto } from './dtos/UserDashboard.dto';
import { ClientDashboardDto } from './dtos/ClientDashboard.dto';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class GeneralService {
  constructor(
    private readonly entityManager: EntityManager,
    private clientsService: ClientsService,
  ) {}

  async getUserDashboard(userId: number): Promise<UserDashboardDto> {
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

  async getClientDashboard(
    clientId: number,
    byUserId: number,
  ): Promise<ClientDashboardDto> {
    await this.clientsService.getClientIfClientBelongsToUser(
      byUserId,
      clientId,
    );

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
