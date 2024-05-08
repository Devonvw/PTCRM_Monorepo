import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsBiggerThan } from "src/decorators/validators/is-bigger-than";
import { Column } from "typeorm";

export class CreateUpdateClientGoalDto {
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
  @IsBiggerThan('startValue', { message: 'Completed value must be bigger than start value' })
  @ApiProperty({ type: 'number' })
  completedValue: number;

  //NOTE: Current value and completed value are set automatically when the client goal is created.
}
