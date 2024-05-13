import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { CreateMeasurementDto } from "src/measurements/dtos/CreateMeasurementDto";
import { Measurement } from "src/measurements/entities/measurement.entity";
import { Column } from "typeorm";

export class UpdateAssessmentDto{ 
  //. The measurements can be updated either one by one (using the measurements controller) or all at once (using the assessments controller). Deleting a measurement is only possible using the measurements controller.
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Measurement)
  @ApiProperty({ type: Measurement, isArray: true })
  measurements: Measurement[];

  @Column()
  @IsOptional()
  @ApiProperty({type: 'string'})
  notes: string;
}