import { Test, TestingModule } from '@nestjs/testing';
import { ClientGoalAchievementService } from './client-goal-achievement.service';

describe('ClientGoalAchievementService', () => {
  let service: ClientGoalAchievementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientGoalAchievementService],
    }).compile();

    service = module.get<ClientGoalAchievementService>(ClientGoalAchievementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
