import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Column } from "typeorm";

export class CreateUpdateGoalDto {
  @Column()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ type: 'string' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty({ type: 'string' })
  description: string;

  @Column()
  @IsNotEmpty({ message: 'A description on how to measure is required' })
  @ApiProperty({ type: 'string' })
  howToMeasure: string;

  @Column()
  @IsNotEmpty({ message: 'A measurement type is required (i.e. kilogram, meters)' })
  @ApiProperty({ type: 'string' })
  measurementUnit: string;


  //. This field is optional, admins can create globally available goals, users (aka coaches) can create goals for their clients. Goals that are created by users will have a userId associated with them, making them only available to that user.
  // @Column()
  // @IsOptional()
  // @ApiProperty({ type: 'number' })
  // userId: number;
}