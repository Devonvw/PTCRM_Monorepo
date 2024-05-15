import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { OrderByDto } from 'src/utils/dto/order-by.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { SearchDto } from 'src/utils/dto/search.dto';

export class GetMeasurementsQueryDto extends IntersectionType(
  PaginationDto,
  OrderByDto,
  SearchDto,
) {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: 'date' })
  fromDate: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: 'date' })
  tillDate: Date;

  //. Make sure that one (and only one) of the following fields is present in the query: clientId, clientGoalId, assessmentId
  @ValidateIf(
    (query) =>
      (query.assessmentId && query.clientId) ||
      (query.assessmentId && query.clientGoalId) ||
      (query.clientId && query.clientGoalId),
    {
      message:
        'You can only provide assessmentId, clientGoalId or clientId, not more than one',
    },
  )
  @ValidateIf(
    (query) => !query.assessmentId && !query.clientId && !query.clientGoalId,
    {
      message:
        'You must provide assessmentId, clientGoalId or clientId (not more than 1)',
    },
  )
  @IsOptional()
  @IsInt({ message: 'Client id must be an integer' })
  @Type(() => Number)
  @ApiProperty({ type: 'number' })
  clientId: number;

  @IsOptional()
  @IsInt({ message: 'Client goal id must be an integer' })
  @Type(() => Number)
  @ApiProperty({ type: 'number' })
  clientGoalId: number;

  @IsOptional()
  @IsInt({ message: 'Assessment id must be an integer' })
  @Type(() => Number)
  @ApiProperty({ type: 'number' })
  assessmentId: number;
}
