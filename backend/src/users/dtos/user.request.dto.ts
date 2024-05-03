import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ type: 'string' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ type: 'string' })
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  firstname: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ type: 'string' })
  lastname: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @ApiProperty({ type: 'date'})
  dateOfBirth: Date;
}