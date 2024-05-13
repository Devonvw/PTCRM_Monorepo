import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, ValidateIf } from "class-validator";
import { OrderByDto } from "src/utils/dto/order-by.dto";
import { PaginationDto } from "src/utils/dto/pagination.dto";
import { SearchDto } from "src/utils/dto/search.dto";

export class GetAssessmentsQueryDto extends IntersectionType(PaginationDto, OrderByDto, SearchDto) {
  @ValidateIf(
    (query) => query.assessmentId && query.clientId,
    { message: 'You can only provide either clientGoalId or clientId, not both' }
  )
  @ValidateIf(
    (query) => !query.assessmentId && !query.clientId,
    { message: 'You must provide either clientGoalId or clientId (not both)' }
  )
  @IsNumber({}, { message: 'Client id must be a number' })
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  clientId: number;

  @IsNumber({}, { message: 'Client goal id must be a number' })
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  clientGoalId: number;

  @IsOptional()
  @ApiProperty()
  from: Date;

  @IsOptional()
  @ApiProperty()
  to: Date;
}