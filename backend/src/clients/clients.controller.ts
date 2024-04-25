import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(@Query() query: GetAllClientsQueryDto) {
    return await this.clientsService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateUpdateClientDto) {
    return await this.clientsService.create(body);
  }
}
