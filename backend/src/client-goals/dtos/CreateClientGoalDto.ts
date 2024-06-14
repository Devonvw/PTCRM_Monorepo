import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Column } from 'typeorm';

export class CreateClientGoalDto {
  @Column()
  @IsNotEmpty({ message: 'Goal id cannot be empty' })
  @ApiProperty({ type: 'number' })
  goalId: number;

  @Column()
  @IsNotEmpty({ message: 'Client id cannot be empty' })
  @ApiProperty({ type: 'number' })
  clientId: number;

  @Column()
  @IsNotEmpty({ message: 'Start value is required' })
  @ApiProperty({ type: 'number' })
  startValue: number;

  @Column()
  @IsNotEmpty({ message: 'Completed value is required' })
  @ValidateIf((dto) => dto.startValue != dto.completedValue, {
    message: 'Completed value must be different from start value',
  })
  @ApiProperty({ type: 'number' })
  completedValue: number;

  //NOTE: Current value and completed value are set automatically when the client goal is created.
}
