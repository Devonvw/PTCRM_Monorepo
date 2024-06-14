import { Controller, Get, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import Success from 'src/utils/success';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/me')
  async getLoggedInUser(@Req() req: Request) {
    return await this.userService.getLoggedInUser(req.user.id);
  }

  @Put('/me')
  async updateLoggedInUser(@Req() req: Request) {
    const user = await this.userService.updateLoggedInUser(
      req.user.id,
      req.body,
    );
    return Success('Your information was successfully updated.', { user });
  }
}
