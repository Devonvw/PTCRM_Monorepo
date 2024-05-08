import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';
import Pagination from 'src/utils/pagination';
import Search from 'src/utils/search';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';

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
    const orderBy = OrderBy(query, [
      {
        key: 'fullName',
        fields: ['firstName', 'lastName'],
      },
      {
        key: 'email',
        fields: ['email'],
      },
    ]);
    const search = Search(query, [
      {
        field: 'firstName',
      },
      {
        field: 'lastName',
      },
      {
        field: 'email',
      },
    ]);

    const filter = Filters(search, [
      {
        condition: query?.active?.length == 1,
        filter: {
          active: query?.active?.[0] === 'true',
        },
      },
    ]);

    const clients = await this.clientRepository.find({
      ...pagination,
      where: [...filter],
      order: orderBy,
    });

    const totalRows = await this.clientRepository.count({
      where: [...filter],
    });

    return { data: clients, totalRows };
  }

  async findOne(id: number) {
    return await this.clientRepository.findOneBy({ id });
  }
}
