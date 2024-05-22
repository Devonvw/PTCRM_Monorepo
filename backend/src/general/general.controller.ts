import { Controller, Get, Req } from '@nestjs/common';
import { GeneralService } from './general.service';
import { Request } from 'express';

@Controller('general')
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get('/dashboard')
  async getUserDashboard(@Req() req: Request) {
    return await this.generalService.getUserDashboard(req.user.id);
  }
}
