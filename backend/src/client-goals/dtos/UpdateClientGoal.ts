import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateClientGoalDto {
  @Column()
  @IsNotEmpty({ message: 'Start value is required' })
  @ApiProperty({ type: 'number' })
  startValue: number;

  @Column()
  @IsNotEmpty({ message: 'Start value is required' })
  @ApiProperty({ type: 'number' })
  completedValue: number;
}
