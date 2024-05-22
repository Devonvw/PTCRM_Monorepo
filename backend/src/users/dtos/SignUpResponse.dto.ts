import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignUpResponseDto {
  @ApiProperty({ type: 'string' })
  checkoutHref: string;
}
