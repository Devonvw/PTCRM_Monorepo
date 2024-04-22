import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber({}, { message: `The page number can only be a number.` })
  @IsNotEmpty({ message: `Do not forget to fill in the page number.` })
  @ApiProperty()
  pageIndex: number;

  @IsNumber({}, { message: `The page size can only be a number.` })
  @IsNotEmpty({ message: `Do not forget to fill in the page size.` })
  @ApiProperty()
  pageSize: number;
}
