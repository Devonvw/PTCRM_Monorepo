import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import Pagination from 'src/utils/pagination';
import OrderBy from 'src/utils/order-by';
import Search from 'src/utils/search';
import Filters from 'src/utils/filter';
import { GetAllGoalsQueryDto } from './dtos/GetAllGoalsQuery.dto';

@Injectable()
export class GoalsService {
  constructor(@InjectRepository(Goal) private readonly goalRepository: Repository<Goal>) { }

  async createGoal(body: any): Promise<any> {
    //. Create a new goal object
    const goal = new Goal(body);
    //TODO: Check if the user is an admin, if not, check if the userId is filled in, and is the same as the request's userId

    
    return await this.goalRepository.save(goal);
  }
  async updateGoal(body: any): Promise<any> {
    //TODO: Check if the user is an admin, if not, check if the userId is filled in, and is the same as the request's userId


    //. Check if the goal exists
    const goalExists = await this.goalRepository.findOne(body.id);
    if (!goalExists) {
      throw new Error('Goal not found');
    }
    //. Update the goal object
    return await this.goalRepository.update(body.id, body);
  }
  async deleteGoal(body: any): Promise<any> {
    //TODO: Check if the user is an admin, if not, check if the userId of the to-be-deleted goal is the same as the request's userId

    //. Check if the goal exists
    const goalExists = await this.goalRepository.findOne(body.id);
    if (!goalExists) {
      throw new Error('Goal not found');
    }
    //. Delete the goal object
    return await this.goalRepository.delete(body.id);
  }
  async findAll(query: GetAllGoalsQueryDto, userId: number): Promise<any> {
    //TODO: If the user is not an admin, only return the goals that have the same userId as the request's userId or the goals that have no userId (aka global goals)

    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'name',
        fields: ['name'],
      },
      {
        key: 'userId',
        fields: ['userId'],
      }
    ]);
    const search = Search(query, [{ field: 'name' }]);
    //TODO: Allow filtering by only custom goals or by only global goals
    // const filter = Filters(search, [
    //   {
    //     condition: query?.onlyCustom?.length == 1,
    //     filter:{
    //       userId: query?.onlyCustom?.[0] === 'true' ? userId : null,
    //     }
    //   },
    //   {
    //     condition: query?.onlyGlobal?.length == 1,
    //     filter:{
    //       onlyGlobal: query?.onlyGlobal?.[0] === 'true',
    //     }
    //   }
    // ])

    //. Get the goals
    const goals = await this.goalRepository.find({
      ...pagination,
      where: search,
      order: orderBy,
    })

    const totalRows = await this.goalRepository.count({
      where: search,
    });

    return { data: goals, totalRows };
  }

  async findOne(id: number): Promise<any> {
    return await this.goalRepository.findOneBy({ id });
  }
}
