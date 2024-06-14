import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateMeasurementDto } from 'src/measurements/dtos/CreateMeasurementDto';
import { Column } from 'typeorm';

export class CreateAssessmentDto {
  @Column()
  @IsNotEmpty({ message: 'Client id is required' })
  @ApiProperty({ type: 'number' })
  clientId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one measurement is required' })
  @Type(() => CreateMeasurementDto)
  @ApiProperty({ type: CreateMeasurementDto, isArray: true })
  measurements: CreateMeasurementDto[];

  @Column()
  @IsOptional()
  @ApiProperty({ type: 'string' })
  notes?: string;
}
