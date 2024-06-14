import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class MollieWebhookDto {
  @IsOptional()
  @ApiProperty()
  id: string;
}
