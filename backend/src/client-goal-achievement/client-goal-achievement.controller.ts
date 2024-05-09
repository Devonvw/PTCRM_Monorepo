import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateAchievementDto } from './dtos/CreateAchievementDto';
import { ClientGoalAchievementService } from './client-goal-achievement.service';

@Controller('achievements')
export class ClientGoalAchievementController {
  constructor(private readonly clientGoalAchievementService: ClientGoalAchievementService) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateAchievementDto){
    const userId = request.user.id;
    return await this.clientGoalAchievementService.create(userId, body);
  }
}
