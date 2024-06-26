import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { Column } from 'typeorm';

export class CreateAchievementDto {
  @IsInt({ message: 'Client goal id must be an integer' })
  @Type(() => Number)
  @Column()
  @IsNotEmpty({ message: 'Client goal id is required' })
  @ApiProperty({ type: 'number' })
  clientGoalId: number;

  @IsNumber()
  @Type(() => Number)
  @Column()
  @IsNotEmpty({ message: 'Value is required' })
  @ApiProperty({ type: 'number' })
  value: number;
}
