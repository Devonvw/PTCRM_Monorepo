import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateAchievementDto {
  @IsNumber()
  @Type(() => Number)
  @Column()
  @IsNotEmpty({ message: 'Value is required' })
  @ApiProperty({ type: 'number' })
  value: number;
}
