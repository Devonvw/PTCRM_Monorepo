import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShortClientDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  firstName: string;

  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ type: 'string' })
  email: string;
}
