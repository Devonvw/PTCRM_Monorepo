import { ApiProperty } from '@nestjs/swagger';

export class UserDashboardDto {
  @ApiProperty({ type: 'number' })
  clientCount: number;
  @ApiProperty({ type: 'number' })
  completedGoalsCount: number;
  @ApiProperty({ type: 'number' })
  uncompletedGoalsCount: number;
  @ApiProperty({ type: 'number' })
  assessmentCount: number;
}
