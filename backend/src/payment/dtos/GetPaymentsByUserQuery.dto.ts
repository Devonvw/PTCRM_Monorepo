import { IntersectionType } from '@nestjs/swagger';
import { OrderByDto } from 'src/utils/dto/order-by.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class GetPaymentsByUserQueryDto extends IntersectionType(
  PaginationDto,
  OrderByDto,
) {}
