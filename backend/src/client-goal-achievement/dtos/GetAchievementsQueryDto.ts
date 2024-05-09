import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, ValidateIf } from "class-validator";
import { OrderByDto } from "src/utils/dto/order-by.dto";
import { PaginationDto } from "src/utils/dto/pagination.dto";
import { SearchDto } from "src/utils/dto/search.dto";

export class GetAchievementsQueryDto extends IntersectionType (PaginationDto, OrderByDto) {
  @IsEnum(['all', 'allAchieved', 'allNotAchieved'], {
    message: `Show must be 'all', 'allAchieved' or 'allNotAchieved'.`,
  })
  @IsOptional()
  @ApiProperty()
  show: 'all' | 'allAchieved' | 'allNotAchieved';


  //. Provide either clientGoalId or clientId, not both
  @ValidateIf((query) => !query.clientGoalId && !query.clientId, {message: 'You can only provide either clientGoalId or clientId, not both'} )
  @IsInt({ message: `The client goal id can only be a number.`})
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  clientGoalId: number;

  @ValidateIf((query) => !query.clientGoalId && !query.clientId, {message: 'You can only provide either clientGoalId or clientId, not both'} )
  @IsInt({ message: `The client id can only be a number.`})
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  clientId: number;
}