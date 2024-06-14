import { ApiProperty } from '@nestjs/swagger';

export class ClientDashboardDto {
  @ApiProperty({ type: 'number' })
  clientGoalsCount: number;
  @ApiProperty({ type: 'number' })
  completedGoalsCount: number;
  @ApiProperty({ type: 'number' })
  uncompletedGoalsCount: number;
  @ApiProperty({ type: 'number' })
  clientAssessmentsCount: number;
}
