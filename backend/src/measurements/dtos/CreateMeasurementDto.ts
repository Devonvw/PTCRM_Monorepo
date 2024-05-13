import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber } from "class-validator";
import { Column } from "typeorm";

export class CreateMeasurementDto{
  @IsInt({message: 'Client goal id must be an integer'})
  @Type(() => Number)
  @Column()
  @IsNotEmpty({message: 'Client goal id is required'})
  clientGoalId: number
  
  @Column()
  @IsNumber({}, {message: 'Value must be a number'})
  @Type(() => Number)
  @IsNotEmpty({message: 'You must provide a value'})
  value: number;
}