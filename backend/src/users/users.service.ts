import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
  async create(body: any): Promise<User> {
    console.log('password', body);
    //. Create a new user
    const userCreate: User = new User(body);

    //. Check if the user already exists
    const existingUser: User = await this.findByEmail(userCreate.email);
    if (existingUser) {
      throw new ConflictException(
        'There is already a user registered with this email.',
      );
    }

    //TODO: Hash the password
    userCreate.password = await bcrypt.hash(userCreate.password, 10);
    console.log('userCreate', userCreate);
    //. Create a new user in the database
    const user: User = this.userRepository.create(userCreate);

    console.log('user2', user);
    //. Save the user in the database
    this.userRepository.save(user);
    console.log('user', user);

    return user;
  }
}
