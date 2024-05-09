import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUpdateClientDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  firstName: string;

  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  lastName: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ type: 'string' })
  email: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  phone: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  street: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  housenumber: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  housenumberExtra: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  city: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  zipCode: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  country: string;
}
