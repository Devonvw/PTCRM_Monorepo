import { HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserResponseDto } from 'src/users/dtos/user.response.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) { }
  async validateUser(email: string, password: string): Promise<any> {
    const user : User = await this.userService.findByEmail(email);
    const passwordMatch: boolean = user.password === password;
    // const passwordMatch: boolean = await this.passwordMatch(password, user.password);

    if (!passwordMatch){
      //TODO: throw an exception
      return;
    }

    return new UserResponseDto(user);

  }

  async passwordMatch(password: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  async login() : Promise<any>{
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK
    };
  }
  //TODO: This request object should be of type 'Request' but for some reason it doesn't have the session property
  async logout(@Req() request: any): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
  async signup(body: any): Promise<any> {
    const user: User = await this.userService.create(body);
    return new UserResponseDto(user);
  }
}
