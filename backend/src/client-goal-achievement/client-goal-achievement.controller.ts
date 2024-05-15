import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientGoalAchievementService } from './client-goal-achievement.service';
import { CreateAchievementDto } from './dtos/CreateAchievementDto';
import { GetAchievementsQueryDto } from './dtos/GetAchievementsQueryDto';
import { UpdateAchievementDto } from './dtos/UpdateAchievementDto';

@Controller('achievements')
export class ClientGoalAchievementController {
  constructor(
    private readonly clientGoalAchievementService: ClientGoalAchievementService,
  ) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateAchievementDto) {
    const userId = request.user.id;
    return await this.clientGoalAchievementService.create(userId, body);
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Body() body: UpdateAchievementDto,
    @Param('id') id: number,
  ) {
    const userId = request.user.id;
    return await this.clientGoalAchievementService.update(userId, id, body);
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() query: GetAchievementsQueryDto,
  ) {
    const userId = request.user.id;
    return await this.clientGoalAchievementService.findAll(userId, query);
  }

  @Get(':id')
  async find(@Req() request: Request, @Param('id') achievementId: number) {
    const userId = request.user.id;
    return await this.clientGoalAchievementService.find(userId, achievementId);
  }
}
