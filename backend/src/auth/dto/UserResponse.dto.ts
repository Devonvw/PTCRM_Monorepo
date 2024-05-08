import { IsNumber } from 'class-validator';

export class UserResponseDto {
  @IsNumber()
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
