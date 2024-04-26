import { Controller, Get, Post,Req,UseGuards, Body } from '@nestjs/common';
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
    console.log("res: ", res);
    return res;
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(): Promise<any>{
    return this.authService.login();
  }
}
