import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsBiggerThan } from "src/decorators/validators/is-bigger-than";
import { Column } from "typeorm";

export class UpdateClientGoalDto {
  @Column()
  @IsNotEmpty({ message: 'New value is required' })
  @ApiProperty({ type: 'number' })
  newValue: number;

  //NOTE: Current value and completed value are set automatically when the client goal is created.
}
