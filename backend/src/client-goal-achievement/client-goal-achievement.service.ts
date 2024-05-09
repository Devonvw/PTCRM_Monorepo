import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGoalAchievement } from './entities/client-goal-achievement.entity';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dtos/CreateAchievementDto';
import { Client } from 'src/clients/entities/client.entity';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';

@Injectable()
export class ClientGoalAchievementService {
  constructor(@InjectRepository(ClientGoalAchievement) private readonly clientGoalAchievementRepository: Repository<ClientGoalAchievement>, @InjectRepository(ClientGoal) private readonly clientGoalRepository: Repository<ClientGoal>) { }
  async create(userId: number, body: CreateAchievementDto): Promise<any> {
    //. Make sure the provided client belongs to the coach (user)
    await this.checkIfClientBelongsToUser(userId, body.clientGoalId);

    //. Get the client goal's current value
    const currentValue: any = await this.clientGoalRepository.findOne({
      where: {
        id: body.clientGoalId
      },
      select: ['currentValue']
    });
    console.log("currentValue:", currentValue);
    //. Create a new client goal achievement object
    const achievement = new ClientGoalAchievement({
      ...body,
      achievedAt: null,
      achieved: currentValue >= body.value,
    });

    return await this.clientGoalAchievementRepository.save(achievement);
  }

  private async checkIfClientBelongsToUser(userId: number, clientId: number) {
    //. Make sure the client belongs to the coach (user)
    const res = await this.clientGoalRepository.findOne({
      where: {
        id: clientId,
        client: { user: { id: userId } }
      },
      relations: ['client', 'client.user']
    });

    if (!res) {
      throw new NotFoundException('This client does not exist or does not belong to you.');
    }

    return true;
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
