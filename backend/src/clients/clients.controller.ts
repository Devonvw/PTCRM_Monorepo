import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';
import { Request } from 'express';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(@Req() req: Request, @Query() query: GetAllClientsQueryDto) {
    return await this.clientsService.findAll(query, req.user.userId || 1);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.findOne(id, req.user.userId || 1);
  }

  @Post()
  async create(@Req() req: Request, @Body() body: CreateUpdateClientDto) {
    return await this.clientsService.create(body, req.user.userId || 1);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateClientDto,
  ) {
    return await this.clientsService.update(id, body, req.user.userId || 1);
  }
}
