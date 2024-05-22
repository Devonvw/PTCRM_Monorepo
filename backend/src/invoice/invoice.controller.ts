import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response, Request } from 'express';
import mime from 'mime-types';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRoles } from 'src/types/roles.enums';
import { GetInvoicesByUserQueryDto } from './dtos/GetInvoicesByUserQuery.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Roles([EnumRoles.USER])
  @Get('/my-invoices')
  async getInvoicesByMe(
    @Query() query: GetInvoicesByUserQueryDto,
    @Req() req: Request,
  ) {
    return await this.invoiceService.getInvoicesByUser(
      query,
      req.user.id,
      req.user.id,
    );
  }

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
