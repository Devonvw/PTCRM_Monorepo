import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByEmail(email: string) : Promise<User | null> {
    return this.userRepository.findOneBy({email});
  }
  async create(body: any): Promise<User> {
    //. Create a new user
    var user : User = new User(body);

    //TODO: Hash the password
    // user.password = bcrypt.hashSync(user.password, 10);

    //. Create a new user in the database
    const res : User = this.userRepository.create(user);

    //. Save the user in the database
    this.userRepository.save(res);

    return res;
  }
}
