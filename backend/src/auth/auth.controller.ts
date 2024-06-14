import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { LocalGuard } from 'src/guards/local.guard';
import { SignUpDto } from 'src/users/dtos/SignUp.dto';
import Success from 'src/utils/success';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/my-info')
  async getUserAuthData(@Req() request: Request) {
    return await this.authService.getUserAuthData(request.user.id);
  }

  //. The public decorator is used to allow access to the signup and login routes without authentication
  @Public()
  @Post('/signup')
  async signup(@Body() body: SignUpDto) {
    const signupRes = await this.authService.signup(body);
    return Success(
      'You are successfully signed up. You will now be directed to the payment page.',
      signupRes,
    );
  }

  @UseGuards(LocalGuard)
  @Public()
  @Post('/login')
  async login(@Body() body: any) {
    const user = await this.authService.login(body.email);
    return Success('Login successful', { user });
  }

  @Delete('/logout')
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
