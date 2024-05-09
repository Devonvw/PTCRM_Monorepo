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
import { CreateSignUpClientDto } from './dtos/CreateSignUpClient.dto';
import Success from 'src/utils/success';
import { Public } from 'src/decorators/public.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Public()
  @Get('/sign-up/:token')
  async getSignUpDetails(@Param('token') token: string) {
    return await this.clientsService.getSignUpDetails(token);
  }

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
    const client = await this.clientsService.create(body, req.user.userId || 1);
    return Success('Client created successfully', { client });
  }

  @Post('/sign-up')
  async createSignUp(@Req() req: Request, @Body() body: CreateSignUpClientDto) {
    const client = await this.clientsService.createSignUp(
      body,
      req.user.userId || 1,
    );
    return Success('Client sign up created successfully', { client });
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUpdateClientDto,
  ) {
    return await this.clientsService.update(id, body, req.user.userId || 1);
  }

  @Public()
  @Put('/sign-up/:token')
  async signUpClient(
    @Param('token') token: string,
    @Body() body: CreateUpdateClientDto,
  ) {
    await this.clientsService.signUpClient(body, token);
    return Success('Signed up successfully');
  }
}
