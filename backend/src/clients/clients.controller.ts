import { Body, Controller, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/CreateClient.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() body: CreateClientDto) {
    return await this.clientsService.create(body);
  }
}
