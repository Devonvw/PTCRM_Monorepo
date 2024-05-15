import { Test, TestingModule } from '@nestjs/testing';
import { ClientGoalAchievementController } from './client-goal-achievement.controller';

describe('ClientGoalAchievementController', () => {
  let controller: ClientGoalAchievementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientGoalAchievementController],
    }).compile();

    controller = module.get<ClientGoalAchievementController>(ClientGoalAchievementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
