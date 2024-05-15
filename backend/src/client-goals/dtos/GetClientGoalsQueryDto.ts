import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { OrderByDto } from 'src/utils/dto/order-by.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class GetClientGoalsQueryDto extends IntersectionType(
  PaginationDto,
  OrderByDto,
) {
  @IsInt({ message: `The client id can only be a number.` })
  @Type(() => Number)
  @ApiProperty()
  clientId: number;

  @IsEnum(['all', 'completed', 'uncompleted'], {
    message: `Show must be 'all', 'completed' or 'uncompleted'.`,
  })
  @IsOptional()
  @ApiProperty()
  show: 'all' | 'completed' | 'uncompleted';
}
