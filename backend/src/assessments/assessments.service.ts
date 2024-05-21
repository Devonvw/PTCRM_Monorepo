import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGoalAchievement } from 'src/client-goal-achievement/entities/client-goal-achievement.entity';
import { ClientGoalsService } from 'src/client-goals/client-goals.service';
import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { ClientsService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';
import Pagination from 'src/utils/pagination';
import { Between, LessThan, Repository } from 'typeorm';
import { CreateAssessmentDto } from './dtos/CreateAssessmentDto';
import { GetAssessmentsQueryDto } from './dtos/GetAssessmentsQueryDto';
import { InitiateAssessmentDto } from './dtos/InitiateAssessmentDto';
import { InitiateAssessmentResponseDto } from './dtos/InitiateAssessmentResponseDto';
import { UpdateAssessmentDto } from './dtos/UpdateAssessmentDto';
import { Assessment } from './entities/assessment.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(ClientGoal)
    private clientGoalRepository: Repository<ClientGoal>,
    @Inject(ClientsService) private clientService,
    @Inject(ClientGoalsService) private clientGoalService,
  ) {}

  //. This function retrieves all of the measurements that are to be made to make up a new assessment. It is called when a user (aka coach) initiates a new assessment.
  async initiate(
    userId: number,
    body: InitiateAssessmentDto,
  ): Promise<InitiateAssessmentResponseDto> {
    //. Make sure the client belongs to the coach (user) (ignore the response, we don't need to client object)
    await this.clientService.getClientIfClientBelongsToUser(
      userId,
      body.clientId,
    );

    //. Get the client's goals (that are not completed, meaning measurements can still take place for them)
    const clientGoals: ClientGoal[] = await this.clientGoalRepository.find({
      where: {
        client: { id: body.clientId },
        completed: false,
      },
      relations: ['goal'],
    });

    if (clientGoals.length === 0 || !clientGoals) {
      throw new NotFoundException(
        'This client has no goals that are not completed.',
      );
    }

    //. Return a list of client goals that are not completed
    return { clientId: body.clientId, measurementsToPerform: clientGoals };
  }
  async create(userId: number, body: CreateAssessmentDto): Promise<any> {
    const achievementsObtained: ClientGoalAchievement[] = [];
    //. Create a transaction to ensure that the assessment and all its measurements are saved or none are saved if an error occurs
    await this.assessmentRepository.manager.transaction(
      async (entityManager) => {
        //. Make sure the client belongs to the coach (user)
        await this.clientService.getClientIfClientBelongsToUser(
          userId,
          body.clientId,
        );

        //. Make sure that all the measurements' client goals exist AND belong to the client
        for (const measurement of body.measurements) {
          const clientGoal: ClientGoal = await entityManager.findOne(
            ClientGoal,
            {
              where: {
                id: measurement.clientGoalId,
                client: { id: body.clientId },
              },
            },
          );

          if (!clientGoal) {
            throw new NotFoundException(
              `The client goal with id ${measurement.clientGoalId} does not exist or does not belong to the client.`,
            );
          }
        }

        //. Create a new assessment object
        const assessment: Assessment = {
          client: { id: body.clientId } as Client,
          measurements: null,
          performedAt: new Date(),
          notes: body.notes,
          id: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        //. Save the assessment object to the database
        const savedAssessment = await entityManager.save(
          Assessment,
          assessment,
        );

        //. Save the measurements to the database
        for (const measurement of body.measurements) {
          //. Create a new measurement object
          const measurementToSave = new Measurement({
            ...measurement,
            assessment: { id: savedAssessment.id } as Assessment,
            clientGoal: { id: measurement.clientGoalId } as ClientGoal,
          });

          //. Save the measurement object to the database
          await entityManager.save(Measurement, measurementToSave);

          //. Update the client goal's current value
          const clientGoal: ClientGoal = await entityManager.findOne(
            ClientGoal,
            {
              where: { id: measurement.clientGoalId },
              relations: ['achievements'],
            },
          );

          clientGoal.currentValue = measurement.value;

          //. Check if the client goal has been completed
          clientGoal.completed = this.clientGoalIsCompleted(
            clientGoal.currentValue,
            clientGoal.startValue,
            clientGoal.completedValue,
          );

          //. REMOVED If the goal has not been completed yet, check if any achievements have been made
          // else {
          //   if (clientGoal.achievements.length > 0) {
          //     for (const achievement of clientGoal.achievements) {
          //       if (
          //         measurement.value >= achievement.value &&
          //         !achievement.achieved
          //       ) {
          //         achievement.achieved = true;
          //         achievement.achievedAt = new Date();
          //         achievementsObtained.push(achievement);
          //       }
          //     }
          //   }
          // }
          await entityManager.save(ClientGoal, clientGoal);
        }
      },
    );
    //. Return a success message (if any achievements were obtained, list them in the message)
    if (achievementsObtained.length > 0) {
      return {
        message: 'Assessment saved',
        achievements: achievementsObtained,
      };
    }
    return 'Assessment saved';
  }

  async findAll(userId: number, query: GetAssessmentsQueryDto): Promise<any> {
    //. Make sure the client belongs to the coach (user)
    if (query?.clientId) {
      const client = await this.clientService.getClientIfClientBelongsToUser(
        userId,
        query.clientId,
      );
      if (!client) {
        throw new NotFoundException(
          'This client does not exist or does not belong to you.',
        );
      }
      return await this.findAllForClient(client.id, query);
    } else if (query?.clientGoalId) {
      const clientGoal =
        await this.clientGoalService.clientGoalExistsAndBelongsToUser(
          userId,
          query.clientGoalId,
        );
      if (!clientGoal) {
        throw new NotFoundException(
          'This client goal does not exist or does not belong to a client of yours.',
        );
      }
      return await this.findAllForClientGoal(clientGoal.id, query);
    }
    //. If no client or client goal id is provided, throw an error (class-validation will prevent this from happening, but it's good to have a backup)
    throw new NotFoundException('Please provide a client or client goal id.');
  }
  async findAllForClient(
    clientId: number,
    query: GetAssessmentsQueryDto,
  ): Promise<any> {
    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'performedAt',
        fields: ['performedAt'],
      },
    ]);

    const filter = Filters(null, [
      {
        condition: !!query?.from && !!query?.to,
        filter: {
          performedAt: Between(query.from, query.to),
        },
      },
      {
        condition: true,
        filter: {
          measurements: { clientGoal: { client: { id: clientId } } },
        },
      },
    ]);

    //. Get all the assessments for the client
    const assessments = await this.assessmentRepository.find({
      ...pagination,
      where: [...filter],
      order: orderBy,
      relations: ['measurements'],
    });

    //. Get the total number of rows
    const totalRows = await this.assessmentRepository.count({
      where: [...filter],
    });

    return { data: assessments, totalRows };
  }
  async findAllForClientGoal(
    clientGoalId: number,
    query: GetAssessmentsQueryDto,
  ): Promise<any> {
    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'performedAt',
        fields: ['performedAt'],
      },
    ]);

    const filter = Filters(null, [
      {
        condition: !!query?.from && !!query?.to,
        filter: {
          performedAt: Between(query.from, query.to),
        },
      },
      {
        condition: true,
        filter: {
          measurements: { clientGoal: { id: clientGoalId } },
        },
      },
    ]);

    //. Find all the assessments and measurements for the client goal
    const assessments = await this.assessmentRepository.find({
      ...pagination,
      where: [...filter],
      order: orderBy,
      relations: ['measurements'],
    });

    //. Get the total number of rows
    const totalRows = await this.assessmentRepository.count({
      where: [...filter],
    });

    return { data: assessments, totalRows };
  }

  async findOne(userId: number, assessmentId: number): Promise<any> {
    //. Make sure the client belongs to the coach (user)
    const assessment = await this.assessmentExistsAndBelongsToUser(
      assessmentId,
      userId,
      true,
    );

    return assessment;
  }
  async delete(userId: number, assessmentId: number): Promise<any> {
    //. Make sure the client belongs to the coach (user)
    const assessment = await this.assessmentExistsAndBelongsToUser(
      assessmentId,
      userId,
      true,
    );

    //. Get the most recent assessment before the one being deleted
    const mostRecentAssessment = await this.assessmentRepository.findOne({
      where: {
        client: { id: assessment.client.id },
        performedAt: LessThan(assessment.performedAt),
      },
      order: { performedAt: 'DESC' },
      relations: ['measurements', 'measurements.clientGoal'],
    });

    //. If there is a most recent assessment, set the client goals' values to the most recent assessment's values, otherwise set them to the start values. Check if the client goals has been completed or not, and set the completed value accordingly
    if (mostRecentAssessment) {
      for (const measurement of assessment.measurements) {
        const clientGoal = await this.clientGoalRepository.findOne({
          where: { id: measurement.clientGoal.id },
        });

        clientGoal.currentValue = mostRecentAssessment.measurements.find(
          (m) => m.clientGoal.id === clientGoal.id,
        )?.value;

        clientGoal.completed = this.clientGoalIsCompleted(
          clientGoal.currentValue,
          clientGoal.startValue,
          clientGoal.completedValue,
        );

        await this.clientGoalRepository.save(clientGoal);
      }
    } else {
      for (const measurement of assessment.measurements) {
        const clientGoal = await this.clientGoalRepository.findOne({
          where: { id: measurement.clientGoal.id },
        });

        clientGoal.currentValue = clientGoal.startValue;

        await this.clientGoalRepository.save(clientGoal);
      }
    }

    //. Remove the clientGoal object from the measurements of the assessment to prevent wrongful deletion of the clientGoal object
    assessment.measurements?.forEach((m) => {
      delete m.clientGoal;
    });

    //. Use remove to delete the assessment and its measurements (delete only removes the assessment, not its measurements and causes a foreign key constraint error)
    await this.assessmentRepository.remove(assessment);

    return { message: 'Assessment deleted' };
  }
  async update(
    userId: number,
    assessmentId: number,
    body: UpdateAssessmentDto,
  ): Promise<any> {
    //. Make sure the client belongs to the coach (user)
    const assessment = await this.assessmentExistsAndBelongsToUser(
      assessmentId,
      userId,
    );

    assessment.notes = body.notes;
    assessment.updatedAt = new Date();
    assessment.measurements = body.measurements;

    return await this.assessmentRepository.save(assessment);
  }
  async assessmentExistsAndBelongsToUser(
    assessmentId: number,
    userId: number,
    getDeepRelations = false,
  ): Promise<Assessment> {
    //. Check if the assessment exists and belongs to the user
    const assessment = await this.assessmentRepository.findOne({
      where: {
        id: assessmentId,
        client: { user: { id: userId } },
      },
      relations: this.determineRelationRetrieval(getDeepRelations),
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return assessment;
  }
  determineRelationRetrieval = (getDeepRelations: boolean) => {
    return getDeepRelations
      ? [
          'client',
          'measurements',
          'measurements.clientGoal',
          'measurements.clientGoal.goal',
        ]
      : ['measurements', 'client'];
  };

  //. Check if the client goal has been completed (if the start value is less than the completed value, the goal is completed if the current value is greater than or equal to the completed value, and vice versa)
  clientGoalIsCompleted = (
    newValue: number,
    startValue: number,
    completedValue: number,
  ) => {
    if (startValue < completedValue) {
      return newValue >= completedValue;
    } else {
      return newValue <= completedValue;
    }
  };
}
