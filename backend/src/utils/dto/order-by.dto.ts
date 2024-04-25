import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches, IsEnum, IsString } from 'class-validator';

export class OrderByDto {
  @IsString({ message: 'De sorteer kolom moet een string zijn' })
  @IsOptional()
  @ApiProperty()
  orderByColumn: string = 'id';

  @IsEnum(['ASC', 'DESC'], {
    message: 'De sorteer richting moet ASC of DESC zijn',
  })
  @ApiProperty()
  orderDirection: 'ASC' | 'DESC' = 'DESC';
}
