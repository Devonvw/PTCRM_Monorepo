import { HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserResponseDto } from 'src/users/dtos/user.response.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) { }
  async validateUser(email: string, providedPassword: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      //TODO: throw an exception
      return;
    }

    const passwordMatch: boolean = user.password === providedPassword;
    // const passwordMatch: boolean = await this.passwordMatch(password, user.password);

    if (!passwordMatch) {
      //TODO: throw an exception
      return;
    }
    return (({ id, password, ...returnUser }) => returnUser)(user);
  }

  async passwordMatch(password: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  async login(email: string): Promise<any> {
    const user  = await this.userService.findByEmail(email);
    return (({ id, password, ...returnUser }) => returnUser)(user);
  }
  //TODO: This request object should be of type 'Request' but for some reason it doesn't have the session property
  async logout(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
  async signup(body: any): Promise<any> {
    const user: User = await this.userService.create(body);
    return (({ id, password, ...returnUser }) => returnUser)(user);
  }
}
