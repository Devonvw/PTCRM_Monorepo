import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({ type: 'string' })
  checkoutHref: string;
}
