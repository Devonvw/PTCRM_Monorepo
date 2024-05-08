import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { ClientGoalsService } from './client-goals.service';
import { GetAllClientGoalsQueryDto } from './dtos/GetClientGoalsQueryDto';
import { Request } from 'express';

@Controller('client-goals')
export class ClientGoalsController {
  constructor(private readonly clientGoalsService: ClientGoalsService) { }

  @Post()
  async create(@Req() request: Request) {
    //. Retrieve the user id from the request object
    const userId = request.user.id;
    return await this.clientGoalsService.create(userId, request.body);
  }
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {

  }
  @Delete(':id')
  async delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {

  }
  @Get()
  async findAll(@Req() request: Request, @Query() query: GetAllClientGoalsQueryDto) {

  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {

  }
}
