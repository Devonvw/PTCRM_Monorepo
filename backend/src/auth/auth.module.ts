import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Session } from 'src/auth/session';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}
