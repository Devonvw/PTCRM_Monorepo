import { Controller, Get, Post,Req,UseGuards, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request} from 'express'
import { LocalGuard } from 'src/guards/local.guard';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { EnumRoles } from 'src/enums/roles.enums';

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

  // @UseGuards(AuthenticatedGuard)
  @Get('test')
  @UseGuards(RolesGuard)
  @Roles([EnumRoles.ADMIN])
  getProfile(){
    return "I am authenticated";
  }
  @Get('test2')
  // @Roles(['admin'])
  getProfile2(){
    return "I am authenticated as admin";
  }
}
