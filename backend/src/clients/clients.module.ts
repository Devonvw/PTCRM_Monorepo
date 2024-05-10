import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  providers: [ClientsService, UsersService, MailService],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
