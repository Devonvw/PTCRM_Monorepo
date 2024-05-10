import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUpdateClientDto } from './dtos/CreateUpdateClient.dto';
import { GetAllClientsQueryDto } from './dtos/GetAllClientsQuery.dto';
import Pagination from 'src/utils/pagination';
import Search from 'src/utils/search';
import Filters from 'src/utils/filter';
import OrderBy from 'src/utils/order-by';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { CreateSignUpClientDto } from './dtos/CreateSignUpClient.dto';
import { SignUpDetailsResponseDto } from './dtos/SignUpDetailsResponse.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly entityManager: EntityManager,
    private mailService: MailService,
    private userService: UsersService,
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

  async createSignUp(body: CreateSignUpClientDto, userId: number) {
    const clientExists = await this.clientRepository.findOneBy({
      email: body.email,
    });

    if (clientExists) {
      throw new ConflictException(
        'This email is already in use. Please use another one.',
      );
    }

    const signupToken = uuidv4();

    const client = new Client({
      ...body,
      signupToken,
      user: { id: userId } as User,
    });

    await this.entityManager.save(client);

    const user = await this.userService.findById(userId);

    //Send sign up email to client
    this.mailService.sendClientSignupEmail(
      body.email,
      user.company,
      client,
      signupToken,
    );

    return client;
  }

  async update(id: number, body: CreateUpdateClientDto, userId: number) {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientRepository.update({ id }, body);
  }

  async delete(id: number, userId: number) {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

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

  async getSignUpDetails(
    signupToken: string,
  ): Promise<SignUpDetailsResponseDto> {
    const client = await this.clientRepository.findOne({
      where: { signupToken },
      relations: {
        user: true,
      },
    });

    if (!client) {
      throw new ConflictException('This is not a valid sign up link.');
    }

    const user = await this.userService.findById(client.user.id);

    return { client, company: user.company };
  }

  async signUpClient(body: CreateUpdateClientDto, signupToken: string) {
    const client = await this.clientRepository.findOne({
      where: { signupToken },
    });

    if (!client) {
      throw new ConflictException('This is not a valid sign up link.');
    }

    await this.clientRepository.update(
      { id: client.id },
      { ...body, signupToken: null },
    );

    //Send welcome email to client
  }

  //. Check if client belongs to the requesting user
  async getClientIfClientBelongsToUser(userId: number, clientId: number) {
    const client = await this.clientRepository.findOne({
      where: {
        id: clientId,
        user: { id: userId },
      },
    });

    if (!client) {
      throw new NotFoundException('This client does not exist or does not belong to you.');
    }

    return client;
  }
}
