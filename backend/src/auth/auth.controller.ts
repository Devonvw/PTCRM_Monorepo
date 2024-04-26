import { Controller, Get, Post,Req,UseGuards, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request} from 'express'
import { LocalGuard } from 'src/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('logout')
  logout(@Req() request: Request){
    return this.authService.logout(request);
  }

  @Post('signup')
  async signup(@Body() body: any){
    const res = await this.authService.signup(body);
    return res;
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: any): Promise<any>{
    const res : Response = await this.authService.login(body.email);
    return this.authService.login(body.email);
  }
}
