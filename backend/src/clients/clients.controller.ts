import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateUpdateClientDto) {
    return await this.clientsService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateClientDto,
  ) {
    return await this.clientsService.update(id, body);
  }
}
