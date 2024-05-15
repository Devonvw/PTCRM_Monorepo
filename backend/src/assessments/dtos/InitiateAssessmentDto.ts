import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber } from "class-validator";
import { Column } from "typeorm";

export class InitiateAssessmentDto{
  @IsInt({message: 'Client id must be an integer'})
  @Type(() => Number)
  @Column()
  @IsNotEmpty({message: 'Client id is required'})
  @ApiProperty({type: 'number'})
  clientId: number;
}