import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnumRoles } from 'src/types/roles.enums';

export class UserAuthDataDto {
  @ApiProperty({ type: 'boolean' })
  hasMandate: boolean;

  @ApiProperty({ type: EnumRoles })
  role: EnumRoles;
}
