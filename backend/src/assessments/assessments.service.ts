import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from './entities/assessment.entity';
import { Repository } from 'typeorm';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { ClientsService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';
import { InitiateAssessmentDto } from './dtos/InitiateAssessmentDto';
import { InitiateAssessmentResponseDto } from './dtos/InitiateAssessmentResponseDto';
import { CreateAssessmentDto } from './dtos/CreateAssessmentDto';

@Injectable()
export class AssessmentsService {
  constructor(@InjectRepository(Assessment) private assessmentRepository: Repository<Assessment>, @InjectRepository(ClientGoal) private clientGoalRepository: Repository<ClientGoal>, @Inject(ClientsService) private clientService) { }
  //. This function retrieves all of the measurements that are to be made to make up a new assessment. It is called when a user (aka coach) initiates a new assessment.
  async initiate(userId: number, body: InitiateAssessmentDto): Promise<InitiateAssessmentResponseDto> {
    //. Make sure the client belongs to the coach (user) (ignore the response, we don't need to client object)
    await this.clientService.getClientIfClientBelongsToUser(userId, body.clientId);

    //. Get the client's goals (that are not completed, meaning measurements can still take place for them)
    const clientGoals: ClientGoal[] = await this.clientGoalRepository.find({
      where: {
        client: { id: body.clientId },
        completed: false
      },
      relations: ['goal']
    })

    if (clientGoals.length === 0 || !clientGoals){
      throw new NotFoundException('This client has no goals that are not completed.');
    } 

    //. Return a list of client goals that are not completed
    return { clientId: body.clientId, measurementsToPerform: clientGoals };
  }
  async create(userId: number, body: CreateAssessmentDto) : Promise<string> {
    //. Make sure the client belongs to the coach (user)
    await this.clientService.getClientIfClientBelongsToUser(userId, body.clientId);

    //. Make sure that all the measurements' client goals exist AND belong to the client
    for (const measurement of body.measurements){
      const clientGoal: ClientGoal = await this.clientGoalRepository.findOne({
        where: {
          id: measurement.clientGoalId,
          client: { id: body.clientId }
        }
      });

      if (!clientGoal){
        throw new NotFoundException(`The client goal with id ${measurement.clientGoalId} does not exist or does not belong to the client.`);
      }
    }

    //. Create a new assessment object
    const assessment : Assessment = {
      client: { id: body.clientId } as Client, measurements: null, performedAt: new Date(), notes: body.notes,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("assessment:",assessment);
    console.log("measurements:",body.measurements);
    
    return 'Assessment saved';
  }


}
