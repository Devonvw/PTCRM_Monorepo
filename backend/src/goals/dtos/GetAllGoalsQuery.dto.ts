import { IntersectionType } from "@nestjs/swagger";
import { OrderByDto } from "src/utils/dto/order-by.dto";
import { PaginationDto } from "src/utils/dto/pagination.dto";
import { SearchDto } from "src/utils/dto/search.dto";

export class GetAllGoalsQueryDto extends IntersectionType(PaginationDto, OrderByDto, SearchDto){
}