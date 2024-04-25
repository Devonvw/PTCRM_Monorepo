import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderByDto } from 'src/utils/dto/order-by.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { SearchDto } from 'src/utils/dto/search.dto';

export class GetAllClientsQueryDto extends IntersectionType(
  PaginationDto,
  OrderByDto,
  SearchDto,
) {
  @IsArray()
  @IsEnum(['true', 'false'], {
    message: 'De acieve status moet true of false zijn',
  })
  @IsOptional()
  @ApiProperty()
  active: 'true' | 'false'[];
}
