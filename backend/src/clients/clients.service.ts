import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateClientDto } from './dtos/CreateClient.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = new Client(createClientDto);

    await this.entityManager.save(client);

    //Send email to client
  }
}
