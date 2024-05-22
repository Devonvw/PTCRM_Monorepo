import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DownloadDto {
  buffer: Buffer;
  name: string;
  mimeType: string;
}
