import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response, Request } from 'express';
import mime from 'mime-types';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('/:id/download')
  async downloadInvoice(
    @Param('id', ParseIntPipe)
    id: number,
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<StreamableFile> {
    const result = await this.invoiceService.downloadInvoice(id, req.user.id);

    res.set({
      'Content-Type': result?.mimeType,
      'Content-Disposition': `attachment; filename=${encodeURI(
        result?.name,
      )}.${mime.extension(result?.mimeType)}`,
      Filename: `${encodeURI(result?.name)}.${mime.extension(
        result?.mimeType,
      )}`,
    });

    return new StreamableFile(result.buffer);
  }
}
