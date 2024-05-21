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

export class GetInvoicesByUserQueryDto extends IntersectionType(
  PaginationDto,
  OrderByDto,
) {}
