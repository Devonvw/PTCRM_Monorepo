import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Or, Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import Pagination from 'src/utils/pagination';
import OrderBy from 'src/utils/order-by';
import Search from 'src/utils/search';
import Filters from 'src/utils/filter';
import { GetAllGoalsQueryDto } from './dtos/GetAllGoalsQuery.dto';
import { CreateUpdateGoalDto } from './dtos/CreateUpdateGoalDto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GoalsService {
  constructor(@InjectRepository(Goal) private readonly goalRepository: Repository<Goal>, @InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async createGoal(userId: number, body: CreateUpdateGoalDto): Promise<any> {
    //. Create a new goal object
    const goal = new Goal(body);
    //. Add the user to the goal object
    goal.user = await this.userRepository.findOneBy({ id: userId });
    
    console.log("goal object:", goal);
    return await this.goalRepository.save(goal);
  }
  async updateGoal(goalId, userId, body: CreateUpdateGoalDto): Promise<any> {
    await this.goalExistsAndBelongsToUser(goalId, userId);

    //. Update the goal object
    await this.goalRepository.update(goalId, body);

    return await this.goalRepository.findOneBy({ id: goalId });
  }
  async deleteGoal(userId: number, goalId: number): Promise<any> {
    const goal: Goal = await this.goalExistsAndBelongsToUser(goalId, userId);

    //. Delete the goal object
    await this.goalRepository.delete({ id: goal.id });
    return { message: 'Goal deleted' };
  }
  async findAll(query: GetAllGoalsQueryDto, userId: number): Promise<any> {
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
    console.log('query', query);
    //. Create the filter
    const filter = Filters(search, [
      {
        //. If the onlyCustom query is true, only return the goals that have the same user.id as the request's userId
        condition: query?.show === 'private',
        filter: {
          'user.id': userId,
        }
      },
      {
        //. If the onlyGlobal query is true, only return the goals that have no userId (aka global goals)
        condition: query?.show === 'global',
        filter: {
          'user.id': IsNull(),
        }
      },
      {
        //. If neither onlyCustom nor onlyGlobal are true, return all global and user goals
        condition: !query?.show || query?.show === 'all',
        filter: {
          'user.id': Or(Equal(userId), IsNull())
        }
      }
    ])
    //. Get the goals
    const goals = await this.goalRepository.find({
      ...pagination,
      where: [...filter],
      order: orderBy,
    })

    //. Get the total number of rows
    const totalRows = await this.goalRepository.count({
      where: [...filter],
    });

    return { data: goals, totalRows };
  }

  async findOne(id: number, userId: number): Promise<Goal> {
    try {
      return await this.goalExistsAndBelongsToUser(id, userId);
    } catch (e) {
      //. All exceptions are caught and rethrown as a NotFoundException to avoid leaking information
      throw new NotFoundException('Goal not found');
    }
  }
  private async goalExistsAndBelongsToUser(goalId: number, userId: number): Promise<Goal> {
    //. Check if the goal exists
    const goal = await this.goalRepository.findOne({relations: ['user'], where: { id: goalId }});
    console.log("goal", goal);
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    //. Check if the goal belongs to the user (users may only delete their own goals)
    if (goal.user.id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return goal;
  }

}
