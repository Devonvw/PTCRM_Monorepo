import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';
import Pagination from 'src/utils/pagination';
import { Repository } from 'typeorm';
import { ClientGoalResponseDto } from './dtos/ClientGoalResponseDto';
import { CreateClientGoalDto } from './dtos/CreateClientGoalDto';
import { GetClientGoalsQueryDto } from './dtos/GetClientGoalsQueryDto';
import { GetUncompletedClientGoalsDto } from './dtos/GetUncompletedClientGoalsDto';
import { UpdateClientGoalDto } from './dtos/UpdateClientGoal';
import { ClientGoal } from './entities/client-goal.entity';

@Injectable()
export class ClientGoalsService {
  constructor(
    @InjectRepository(ClientGoal)
    private readonly clientGoalRepository: Repository<ClientGoal>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}
  async create(userId: number, body: CreateClientGoalDto): Promise<ClientGoal> {
    //. Make sure the client belongs to the coach (user)
    const client = await this.clientRepository.findOne({
      where: {
        id: body.clientId,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!client) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    //. Make sure the goal exists
    const goal = await this.goalRepository.findOne({
      where: { id: body.goalId },
    });

    if (!goal) {
      throw new NotFoundException(
        'There was no goal found with the provided id.',
      );
    }

    //. Create a new client goal object
    const clientGoal = new ClientGoal({
      ...body,
      client: { id: body.clientId } as Client,
      goal: { id: body.goalId } as Goal,
      currentValue: body.startValue,
      completed: body.startValue === body.completedValue,
    });
    return await this.clientGoalRepository.save(clientGoal);
  }

  async update(
    id: number,
    userId: number,
    body: UpdateClientGoalDto,
  ): Promise<any> {
    //. Make sure the client, which the client goal belongs to, belongs to the coach (user)
    const clientGoal = await this.clientGoalExistsAndBelongsToUser(userId, id);

    //. Update the start and completed value of the client goal
    clientGoal.startValue = body.startValue;
    clientGoal.completedValue = body.completedValue;

    //. Check if the currentValue is greater than or equal to the completedValue, and if so, set the completed property to true
    if (clientGoal.startValue > clientGoal.completedValue) {
      if (clientGoal.currentValue <= clientGoal.completedValue) {
        clientGoal.completed = true;
      }
    } else {
      if (clientGoal.currentValue >= clientGoal.completedValue) {
        clientGoal.completed = true;
      }
    }

    //. Update the client goal object
    await this.clientGoalRepository.update(clientGoal.id, clientGoal);

    return await this.clientGoalRepository.findOneBy({ id });
  }
  async findAll(userId: number, query: GetClientGoalsQueryDto): Promise<any> {
    //. Make sure the client belongs to the coach (user)
    const client = await this.clientRepository.findOne({
      where: {
        id: query.clientId,
        user: { id: userId },
      },
    });

    if (!client) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'updatedAt',
        fields: ['updatedAt'],
      },
    ]);
    const filter = Filters(null, [
      {
        //. If the show query is uncompleted or not provided, only return the client goals that are not completed
        condition: query?.show === 'uncompleted' || !query?.show,
        filter: {
          completed: false,
        },
      },
      {
        //. If the show query is completed, only return the client goals that are completed
        condition: query?.show === 'completed',
        filter: {
          completed: true,
        },
      },
      {
        //. If the show query is all, return all client goals
        condition: query?.show === 'all',
        filter: {},
      },
      {
        condition: !!query?.clientId,
        filter: {
          client: { id: query.clientId },
        },
      },
    ]);

    //. Get the client goals
    const clientGoals = await this.clientGoalRepository.find({
      ...pagination,
      where: [...filter],
      order: orderBy,
      relations: ['goal'],
    });

    //. Format the client goals to the ClientGoalResponseDto format
    const formattedClientGoals: ClientGoalResponseDto[] = clientGoals.map(
      (clientGoal) => ({
        id: clientGoal.id,
        progress: this.calculateProgress(
          clientGoal.currentValue,
          clientGoal.startValue,
          clientGoal.completedValue,
        ),
        startValue: clientGoal.startValue,
        currentValue: clientGoal.currentValue,
        completedValue: clientGoal.completedValue,
        completed: clientGoal.completed,
        goal: clientGoal.goal,
        client: clientGoal.client,
        // Add any other required properties of ClientGoalResponseDto here
      }),
    );

    //. Get the total number of rows
    const totalRows = await this.clientGoalRepository.count({
      where: [...filter],
    });

    return { data: formattedClientGoals, totalRows };
  }
  private calculateProgress = (
    currentValue: number,
    startValue: number,
    completedValue: number,
  ) => {
    return (
      ((currentValue - startValue) / (completedValue - startValue)) *
      100
    ).toFixed(1);
  };
  async getUncompletedClientGoals(
    userId: number,
    query: GetUncompletedClientGoalsDto,
  ) {
    //. Make sure the client belongs to the coach (user)
    await this.clientExistsAndBelongsToUser(userId, query.clientId);

    //. Return all the clientGoals which are not completed
    const clientgoals = await this.clientGoalRepository.find({
      where: {
        client: { id: query.clientId },
        completed: false,
      },
      relations: ['goal'],
    });

    const totalRows = await this.clientGoalRepository.count({
      where: {
        client: { id: query.clientId },
        completed: false,
      },
    });

    return { data: clientgoals, totalRows };
  }
  async findOne(userId: number, id: number): Promise<any> {
    return await this.clientGoalExistsAndBelongsToUser(userId, id);
  }
  async delete(userId: number, id: number): Promise<any> {
    const clientGoal = await this.clientGoalExistsAndBelongsToUser(userId, id);

    await this.clientGoalRepository.delete({ id: clientGoal.id });
    return { message: 'Client goal deleted' };
  }
  private async clientExistsAndBelongsToUser(
    userId: number,
    clientId: number,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: {
        id: clientId,
        user: { id: userId },
      },
    });

    if (!client) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    return client;
  }

  /// This function checks and returns the client goal if the client goal exists and if the clientgoal's client belongs to the user, and throws an error if not
  private async clientGoalExistsAndBelongsToUser(
    userId: number,
    clientGoalId: number,
  ): Promise<ClientGoal> {
    const clientGoal = await this.clientGoalRepository.findOne({
      where: {
        id: clientGoalId,
        client: { user: { id: userId } },
      },
    });

    if (!clientGoal) {
      throw new NotFoundException(
        'This client goal does not exist or the client does not belong to you.',
      );
    }

    return clientGoal;
  }
}
