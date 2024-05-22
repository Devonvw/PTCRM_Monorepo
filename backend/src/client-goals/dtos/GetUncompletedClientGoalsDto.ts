import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUncompletedClientGoalsDto {
  @IsInt({ message: `The client id can only be a number.` })
  @Type(() => Number)
  @ApiProperty()
  clientId: number;
}
