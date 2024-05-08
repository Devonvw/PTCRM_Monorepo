import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateUpdateGoalDto } from './dtos/CreateUpdateGoalDto';
import { GetAllGoalsQueryDto } from './dtos/GetAllGoalsQuery.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) { }

  @Post()
  async createGoal(@Body() body: CreateUpdateGoalDto) {
    return await this.goalsService.createGoal(body);
  }
  @Put()
  async updateGoal(@Body() body: CreateUpdateGoalDto) {
    return await this.goalsService.updateGoal(body);
  }
  @Delete()
  async deleteGoal(@Body() body: CreateUpdateGoalDto) {
    return await this.goalsService.deleteGoal(body);
  }
  @Get()
  async findAll(@Query() query: GetAllGoalsQueryDto) {
    return await this.goalsService.findAll(query);
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    return await this.goalsService.findOne(id);
  }



}
