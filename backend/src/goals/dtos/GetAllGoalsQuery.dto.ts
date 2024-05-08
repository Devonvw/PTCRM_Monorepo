import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { OrderByDto } from "src/utils/dto/order-by.dto";
import { PaginationDto } from "src/utils/dto/pagination.dto";
import { SearchDto } from "src/utils/dto/search.dto";

export class GetAllGoalsQueryDto extends IntersectionType(PaginationDto, OrderByDto, SearchDto){
  @IsEnum(['true', 'false'], {
    message: 'Only user goals must be true or false.',
  })
  @IsOptional()
  @ApiProperty()
  onlyCustom: 'true' | 'false';

  @IsEnum(['true', 'false'], {
    message: 'Only global goals must be true or false.',
  })
  @IsOptional()
  @ApiProperty()
  onlyGlobal: 'true' | 'false';
}