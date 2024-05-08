import { Controller, Get, Post,Req,UseGuards, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request} from 'express'
import { LocalGuard } from 'src/guards/local.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { EnumRoles } from 'src/types/roles.enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('logout')
  logout(@Req() request: Request){
    return this.authService.logout(request);
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: any){
    const res = await this.authService.signup(body);
    return res;
  }

  @UseGuards(LocalGuard)
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: any): Promise<any>{
    // const res : Response = await this.authService.login(body.email);
    return await this.authService.login(body.email);
  }

  @Get('test')
  getProfile(){
    return "I am authenticated";
  }
  @Get('test2')
  @Roles([EnumRoles.ADMIN])
  getProfile2(){
    return "I am authenticated as admin";
  }
}
