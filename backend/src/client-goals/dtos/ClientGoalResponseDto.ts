import { Goal } from 'src/goals/entities/goal.entity';

export class ClientGoalResponseDto {
  id: number;
  startValue: number;
  currentValue: number;
  completedValue: number;
  completed: boolean = false;
  goal: Goal;
  progressPercentage?: number;
}
