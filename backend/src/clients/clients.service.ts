import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';
import Pagination from 'src/utils/pagination';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(body: CreateUpdateClientDto) {
    const clientExists = await this.clientRepository.findOneBy({
      email: body.email,
    });

    if (clientExists) {
      throw new ConflictException('Client already exists');
    }

    const client = new Client(body);

    await this.entityManager.save(client);

    //Send email to client
  }

  async update(id: number, body: CreateUpdateClientDto) {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new Error('Client not found');
    }

    await this.clientRepository.update({ id }, body);
  }

  async delete(id: number) {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new Error('Client not found');
    }

    await this.clientRepository.delete({ id });
  }

  async findAll(query: GetAllClientsQueryDto) {
    const pagination = Pagination(query);

    const clients = await this.clientRepository.find({
      ...pagination,
    });

    const totalRows = await this.clientRepository.count();

    return { data: clients, totalRows };
  }

  async findOne(id: number) {
    return await this.clientRepository.findOneBy({ id });
  }
}
