import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateUpdateGoalDto } from './dtos/CreateUpdateGoalDto';
import { GetAllGoalsQueryDto } from './dtos/GetAllGoalsQuery.dto';
import { Request } from 'express';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) { }

  @Post()
  async createGoal(@Req() request: Request) {
    const userId = request.user.id;
    return await this.goalsService.createGoal(userId, request.body);
  }
  @Put(':id')
  async updateGoal(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userId: number = request.user.id;
    return await this.goalsService.updateGoal(id, userId, request.body);
  }
  @Delete(':id')
  async deleteGoal(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const userId: number = request.user.id;
    return await this.goalsService.deleteGoal(userId, id);
  }
  @Get()
  async findAll(@Req() request: Request, @Query() query: GetAllGoalsQueryDto) {
    const userId: number = request.user.id;
    return await this.goalsService.findAll(query, userId);
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userId = request.user.id;
    return await this.goalsService.findOne(id, userId);
  }



}