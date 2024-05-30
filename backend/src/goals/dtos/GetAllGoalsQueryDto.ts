import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderByDto } from 'src/utils/dto/order-by.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { SearchDto } from 'src/utils/dto/search.dto';

export class GetAllGoalsQueryDto extends IntersectionType(
  PaginationDto,
  OrderByDto,
  SearchDto,
) {
  @IsEnum(['all', 'private', 'global'], {
    message: `Show must be 'all', 'private' or 'global'.`,
  })
  @IsOptional()
  @ApiProperty()
  show: 'all' | 'private' | 'global';
}
