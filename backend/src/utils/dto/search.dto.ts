import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @ApiProperty()
  search: string;
}
