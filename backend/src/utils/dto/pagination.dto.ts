import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class PaginationDto {
  @IsInt({ message: `The page number can only be a number.`})
  @Type(() => Number)
  @IsNotEmpty({ message: `Do not forget to fill in the page number.` })
  @ApiProperty()
  pageIndex: number;

  @IsInt({ message: `The page size can only be a number.`})
  @Type(() => Number)
  @IsNotEmpty({ message: `Do not forget to fill in the page size.` })
  @ApiProperty()
  pageSize: number;
}
