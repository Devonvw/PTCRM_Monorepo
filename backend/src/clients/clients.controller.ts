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
import { Request } from 'express';
import Success from 'src/utils/success';
import { ClientsService } from './clients.service';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(@Req() req: Request, @Query() query: GetAllClientsQueryDto) {
    return await this.clientsService.findAll(query, req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Req() req: Request, @Body() body: CreateUpdateClientDto) {
    const client = await this.clientsService.create(body, req.user.id);
    return Success('Client created successfully', { client });
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateClientDto,
  ) {
    const client = await this.clientsService.update(id, body, req.user.id);
    return Success('Client updated successfully', { client });
  }
}
