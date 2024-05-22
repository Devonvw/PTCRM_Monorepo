import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { UserResponseDto } from './dto/UserResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/my-info')
  async getUserAuthData(@Req() request: Request) {
    return await this.authService.getUserAuthData(request.user.id);
  }

  @Public()
  @Post('/signup')
  async signup(@Body() body: SignUpDto) {
    const res = await this.authService.signup(body);
    return Success(
      'You are successfully signed up. You will now be directed to the payment page.',
      { ...res },
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
