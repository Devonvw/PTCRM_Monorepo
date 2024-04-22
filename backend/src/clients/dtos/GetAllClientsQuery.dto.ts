import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/utils/pagination.dto';
import { SearchDto } from 'src/utils/search.dto';

export class GetAllClientsQueryDto extends IntersectionType(
  PaginationDto,
  SearchDto,
) {}
