import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { SignUpDto } from 'src/users/dtos/SignUp.dto';
import { SignUpResponseDto } from 'src/users/dtos/SignUpResponse.dto';
import { UsersService } from 'src/users/users.service';
import { UserAuthDataDto } from './dto/UserAuthData.dto';
import { UserResponseDto } from './dto/UserResponse.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async validateUser(email: string, providedPassword: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      //TODO: throw an exception
      return;
    }

    const passwordMatch: boolean = await this.passwordMatch(
      providedPassword,
      user.password,
    );

    if (!passwordMatch) {
      //TODO: throw an exception
      return;
    }
    //. Remove the password from the user object
    delete user.password;

    //. Return the user's id, role and email (this will be set in the request object)
    return { id: user.id, email: user.email, role: user.role };
  }

  async passwordMatch(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  async login(email: string): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(email);
    delete user.password;
    return user;
  }

  async logout(request: Request): Promise<void> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }

  async signup(body: SignUpDto): Promise<SignUpResponseDto> {
    return await this.userService.create(body);
  }

  async getUserAuthData(userId: number): Promise<UserAuthDataDto> {
    const user = await this.userService.findById(userId);

    return { hasMandate: user.hasMandate, role: user.role };
  }
}
