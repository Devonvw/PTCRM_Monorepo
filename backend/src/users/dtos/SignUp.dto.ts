import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ type: 'string' })
  email: string;

  @ValidateIf((query) => query.password != query.passwordConfirm, {
    message: 'Passwords do not match',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ type: 'string' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @ApiProperty({ type: 'string' })
  passwordConfirm: string;

  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  firstname: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ type: 'string' })
  lastname: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  company: string;

  @IsDate()
  @IsNotEmpty({ message: 'Date of birth is required' })
  @ApiProperty({ type: 'date' })
  dateOfBirth: Date;
}