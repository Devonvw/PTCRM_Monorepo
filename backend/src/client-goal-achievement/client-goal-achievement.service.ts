import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { Client } from 'src/clients/entities/client.entity';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';
import Pagination from 'src/utils/pagination';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dtos/CreateAchievementDto';
import { GetAchievementsQueryDto } from './dtos/GetAchievementsQueryDto';
import { UpdateAchievementDto } from './dtos/UpdateAchievementDto';
import { ClientGoalAchievement } from './entities/client-goal-achievement.entity';

@Injectable()
export class ClientGoalAchievementService {
  constructor(
    @InjectRepository(ClientGoalAchievement)
    private readonly clientGoalAchievementRepository: Repository<ClientGoalAchievement>,
    @InjectRepository(ClientGoal)
    private readonly clientGoalRepository: Repository<ClientGoal>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async create(userId: number, body: CreateAchievementDto): Promise<any> {
    //. Make sure the provided client belongs to the coach (user)
    await this.checkIfClientBelongsToUserByClientGoalId(
      userId,
      body.clientGoalId,
    );

    //. Get the client goal's current value
    const currentValue: any = await this.clientGoalRepository.findOne({
      where: {
        id: body.clientGoalId,
      },
      select: ['currentValue'],
    });
    //. Create a new client goal achievement object
    const achievement = new ClientGoalAchievement({
      ...body,
      achievedAt: null,
      achieved: currentValue >= body.value,
      clientGoal: { id: body.clientGoalId } as ClientGoal,
    });

    const res = await this.clientGoalAchievementRepository.save(achievement);

    delete res.clientGoal;
    return res;
  }
  async update(
    userId: number,
    achievementId: number,
    body: UpdateAchievementDto,
  ): Promise<any> {
    //. Make sure the provided client belongs to the coach (user)
    const achievement: ClientGoalAchievement =
      await this.checkIfClientBelongsToUserByAchievementId(
        userId,
        achievementId,
      );

    if (!achievement) {
      throw new NotFoundException(
        'This client goal achievement does not exist or does not belong to a client of yours.',
      );
    }

    //. Make sure the achievement value is not 0 or negative
    if (body.value <= 0) {
      throw new BadRequestException(
        'The achievement value cannot be 0 or negative.',
      );
    }

    //. Make sure the achievement value is not higher than the client goal's completed value
    if (achievement.clientGoal.completedValue <= body.value) {
      throw new BadRequestException(
        `The achievement value cannot be higher or equal to the client goal\'s completed value (which is ${achievement.clientGoal.completedValue}).`,
      );
    }

    //. Make sure the achievement value is not lower than the client goal's start value
    if (achievement.clientGoal.startValue >= body.value) {
      throw new BadRequestException(
        `The achievement value cannot be lower than or equal to the client goal\'s start value (which is ${achievement.clientGoal.startValue}).`,
      );
    }

    //. Update the client goal achievement object (you can only change the achievement value)
    achievement.value = body.value;
    achievement.achieved = achievement.clientGoal.currentValue >= body.value;

    // await this.clientGoalAchievementRepository.update(achievementId, achievement);
    await this.clientGoalAchievementRepository.save(achievement);

    return await this.clientGoalAchievementRepository.findOne({
      where: {
        id: achievementId,
      },
    });
  }

  async findAll(userId: number, query: GetAchievementsQueryDto): Promise<any> {
    //. If the clientGoalId query is provided, only return the achievements for that client goal
    if (query?.clientGoalId) {
      //. Make sure the client goal belongs to the coach (user)
      await this.checkIfClientBelongsToUserByClientGoalId(
        userId,
        query.clientGoalId,
      );
    } else if (query?.clientId) {
      //. Make sure the client belongs to the coach (user)
      await this.checkIfClientBelongsToUserByClientId(userId, query.clientId);
    }

    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'achieved',
        fields: ['achieved'],
      },
      {
        key: 'achievedAt',
        fields: ['achievedAt'],
      },
    ]);
    //. Create the filter
    const filter = Filters(null, [
      {
        condition: !!query?.clientGoalId,
        filter: {
          clientGoal: { id: query.clientGoalId },
        },
      },
      {
        condition: !!query?.clientId,
        filter: {
          clientGoal: { client: { id: query.clientId } },
        },
      },
    ]);

    //. Get the achievements
    const achievements = await this.clientGoalAchievementRepository.find({
      ...pagination,
      where: [...filter],
      order: orderBy,
      relations: ['clientGoal', 'clientGoal.client'],
    });

    //. Remove the clientGoal object from the response
    achievements.forEach((achievement) => {
      delete achievement.clientGoal;
    });

    //. Get the total number of rows
    const totalRows = await this.clientGoalAchievementRepository.count({
      where: [...filter],
    });

    return { data: achievements, totalRows };
  }
  async find(userId: number, achievementId: number): Promise<any> {
    //. Make sure the client goal achievement belongs to the coach (user)
    const achievement = await this.checkIfClientBelongsToUserByAchievementId(
      userId,
      achievementId,
    );

    return achievement;
  }
  private async checkIfClientBelongsToUserByClientGoalId(
    userId: number,
    clientGoalId: number,
  ): Promise<ClientGoal> {
    //. Make sure the client belongs to the coach (user)
    const res = await this.clientGoalRepository.findOne({
      where: {
        id: clientGoalId,
        client: { user: { id: userId } },
      },
      relations: ['client', 'client.user'],
    });

    if (!res) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    return res;
  }
  private async checkIfClientBelongsToUserByAchievementId(
    userId: number,
    achievementId: number,
  ): Promise<ClientGoalAchievement> {
    //. Make sure the client belongs to the coach (user)
    const res = await this.clientGoalAchievementRepository.findOne({
      where: {
        id: achievementId,
        clientGoal: { client: { user: { id: userId } } },
      },
      relations: ['clientGoal', 'clientGoal.client', 'clientGoal.client.user'],
    });

    if (!res) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    return res;
  }
  private async checkIfClientBelongsToUserByClientId(
    userId: number,
    clientId: number,
  ): Promise<Client> {
    //. Make sure the client belongs to the coach (user)
    const res = await this.clientRepository.findOne({
      where: {
        id: clientId,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!res) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    return res;
  }

  // private async getAchievements(userId: number, clientGoalId: number): Promise<any> {
  //   //. Make sure the client for the client goal achievement belongs to the user
  //   const achievement = await this.clientGoalAchievementRepository.findOne({
  //     where: {
  //       clientGoal: {
  //         id: clientGoalId, client: {
  //           user: { id: userId }
  //         }
  //       }
  //     }
  //   });

  //   if (!achievement) {
  //     throw new NotFoundException('This client goal achievement does not exist or does not belong to a client of yours.');
  //   }

  //   return achievement;
  // }
}
