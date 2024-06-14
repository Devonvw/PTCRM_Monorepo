import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserResponseDto {
  
  @IsNotEmpty({message: "Email is required"})
  @ApiProperty({type: "string"})
  email: string;
  
  @IsNotEmpty({message: "Firstname is required"})
  @ApiProperty({type: "string"})
  firstname: string;
  
  @IsNotEmpty({message: "Lastname is required"})
  @ApiProperty({type: "string"})
  lastname: string;
  
  @IsNotEmpty({message: "Role is required"})
  @ApiProperty({type: "string"})
  role: string;
  
  @IsNotEmpty({message: "Created at is required"})
  @ApiProperty({type: "date"})
  createdAt: Date;

  @IsOptional()
  @ApiProperty({type: "date"})
  updatedAt: Date;

}
