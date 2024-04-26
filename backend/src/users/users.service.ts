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
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
  async create(body: any): Promise<User> {
    //. Create a new user
    var userCreate: User = new User(body);

    //. Check if the user already exists
    const existingUser: User = await this.findByEmail(userCreate.email);
    if (existingUser) {
      //TODO: throw an exception saying that the user already exists
      return null;
    }

    //TODO: Hash the password
    // userCreate.password = bcrypt.hashSync(user.password, 10);

    //. Create a new user in the database
    var user: User = this.userRepository.create(userCreate);

    //. Save the user in the database
    this.userRepository.save(user);
    console.log("user", user);

    return user;
  }
}
