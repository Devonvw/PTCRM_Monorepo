import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/me')
  async getLoggedInUser(@Req() req: Request) {
    return await this.userService.getLoggedInUser(req.user.id);
  }
}
