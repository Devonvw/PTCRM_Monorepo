import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';
import Pagination from 'src/utils/pagination';
import Search from 'src/utils/search';
import { EntityManager, Repository } from 'typeorm';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(body: CreateUpdateClientDto, userId: number) {
    const clientExists = await this.clientRepository.findOneBy({
      email: body.email,
    });

    if (clientExists) {
      throw new ConflictException(
        'This email is already in use. Please use another one.',
      );
    }

    const client = new Client({
      ...body,
      user: { id: userId } as User,
    });

    await this.entityManager.save(client);

    return client;
  }

  async update(id: number, body: CreateUpdateClientDto, userId: number) {
    await this.getClientIfClientBelongsToUser(userId, id);

    await this.clientRepository.update({ id }, body);
  }

  async delete(id: number, userId: number) {
    await this.getClientIfClientBelongsToUser(userId, id);

    await this.clientRepository.delete({ id });
  }

  async findAll(query: GetAllClientsQueryDto, userId: number) {
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
      {
        condition: true,
        filter: {
          user: { id: userId },
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

  async findOne(id: number, userId: number) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!client || client.user.id !== userId) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  //. Check if client belongs to the requesting user (coach), if not, throw an error
  async getClientIfClientBelongsToUser(
    userId: number,
    clientId: number,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: {
        id: clientId,
        user: { id: userId },
      },
    });

    if (!client) {
      throw new NotFoundException(
        'This client does not exist or does not belong to you.',
      );
    }

    return client;
  }
}
