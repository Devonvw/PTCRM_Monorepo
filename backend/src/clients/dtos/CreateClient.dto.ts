import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  firstName: string;

  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: 'string' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ type: 'string' })
  email: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  phone: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  streetname: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  houseNumber: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  houseNumberExtra: string;

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
