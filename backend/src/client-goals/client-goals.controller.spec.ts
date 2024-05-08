import { Test, TestingModule } from '@nestjs/testing';
import { ClientGoalsController } from './client-goals.controller';

describe('ClientGoalsController', () => {
  let controller: ClientGoalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientGoalsController],
    }).compile();

    controller = module.get<ClientGoalsController>(ClientGoalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
