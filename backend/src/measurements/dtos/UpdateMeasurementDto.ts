import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateMeasurementDto {
  @Column()
  @IsNumber({}, { message: 'Value must be a number' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'You must provide a value' })
  value: number;
}
