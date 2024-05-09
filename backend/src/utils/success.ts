import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @IsOptional()
  @ApiProperty()
  message: string;

  [key: string]: any;
}

const Success = (message: string, data?: object): SuccessDto => {
  return { message, ...data };
};

export default Success;
