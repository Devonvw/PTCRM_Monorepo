import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGoal } from './entities/client-goal.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class ClientGoalsService {
  constructor(@InjectRepository(ClientGoal) private readonly clientGoalRepository: Repository<ClientGoal>, @InjectRepository(Client) private readonly clientRepository: Repository<Client>) { }
  async create(userId: number, body: any) {
    //. Make sure the client belongs to the coach (user)
    const client = await this.clientRepository.findOne({
      where: {
        id: body.clientId,
        user: { id: userId }
    },
    relations: ['user']
    });

    if (!client) {
      throw new NotFoundException('This client does not exist or does not belong to you.');
    }

    //. Create a new client goal object
    const clientGoal = new ClientGoal(body);
    //. Set the default values
    clientGoal.currentValue = clientGoal.startValue;
    clientGoal.completed = clientGoal.currentValue === clientGoal.completedValue;

    return await this.clientGoalRepository.save(clientGoal);
  }
}
