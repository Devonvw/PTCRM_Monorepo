import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { GetMeasurementsQueryDto } from './dtos/GetMeasurementsQueryDto';
import { UpdateMeasurementDto } from './dtos/UpdateMeasurementDto';
import { MeasurementsService } from './measurements.service';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Delete(':id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const userId = request.user.id;
    return await this.measurementsService.delete(userId, id);
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() body: UpdateMeasurementDto,
  ) {
    const userId = request.user.id;
    return await this.measurementsService.update(userId, id, body);
  }

  @Get()
  async findAll(
    @Req() request: Request,
    @Body() body: GetMeasurementsQueryDto,
  ) {
    const userId = request.user.id;
    return await this.measurementsService.findAll(userId, body);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: number) {
    const userId = request.user.id;
    return await this.measurementsService.findOne(userId, id);
  }
}
