import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { SignUpDto } from './dtos/SignUp.dto';
import { Subscription } from 'src/payment/entities/subscription.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private paymentService: PaymentService,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
  async create(body: SignUpDto): Promise<string> {
    const user = new User({ ...body, subscription: { id: 1 } as Subscription });

    //. Check if the user already exists
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException(
        'There is already a user registered with this email.',
      );
    }

    user.password = await bcrypt.hash(user.password, 10);

    //. Save the user in the database
    const savedUser = await this.userRepository.save(user);

    return await this.paymentService.updateInitialUserSubscription(
      user.subscription.id,
      savedUser.id,
    );
  }
}
