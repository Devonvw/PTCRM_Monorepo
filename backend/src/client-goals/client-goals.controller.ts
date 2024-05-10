import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { ClientGoalsService } from './client-goals.service';
import { GetClientGoalsQueryDto } from './dtos/GetClientGoalsQueryDto';
import { Request } from 'express';
import { CreateClientGoalDto } from './dtos/CreateClientGoalDto';
import { UpdateClientGoalDto } from './dtos/UpdateClientGoal';

@Controller('client-goals')
export class ClientGoalsController {
  constructor(private readonly clientGoalsService: ClientGoalsService) { }

  @Post()
  async create(@Req() request: Request, @Body() body: CreateClientGoalDto) {
    //. Retrieve the user id from the request object
    const userId = request.user.id;
    return await this.clientGoalsService.create(userId, request.body);
  }
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Body() body: UpdateClientGoalDto){
    const userId: number = request.user.id;
    return await this.clientGoalsService.update(id, userId, body);
  }
  @Delete(':id')
  async delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const userId: number = request.user.id;
    return await this.clientGoalsService.delete(userId, id);
  }
  //. This route will be used to retrieve all the client goals of a specific client
  @Get()
  async findAll(@Req() request: Request, @Query() query: GetClientGoalsQueryDto) {
    const userId: number = request.user.id;
    return await this.clientGoalsService.findAll(userId, query);
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userId: number = request.user.id;
    return await this.clientGoalsService.findOne(userId, id);
  }
}
