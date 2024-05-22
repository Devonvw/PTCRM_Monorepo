import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ type: 'string' })
  email: string;

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

  @IsNotEmpty({ message: 'Streetname is required' })
  @ApiProperty({ type: 'string' })
  street: string;

  @IsNotEmpty({ message: 'Housenumber is required' })
  @ApiProperty({ type: 'string' })
  housenumber: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  housenumberExtra: string;

  @IsNotEmpty({ message: 'City is required' })
  @ApiProperty({ type: 'string' })
  city: string;

  @IsNotEmpty({ message: 'Zip code is required' })
  @ApiProperty({ type: 'string' })
  zipCode: string;

  @IsNotEmpty({ message: 'Country is required' })
  @ApiProperty({ type: 'string' })
  country: string;
}
