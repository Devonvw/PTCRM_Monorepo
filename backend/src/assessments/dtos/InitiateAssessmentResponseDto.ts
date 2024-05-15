import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';

export class InitiateAssessmentResponseDto {
  clientId: number;

  measurementsToPerform: ClientGoal[];
}
