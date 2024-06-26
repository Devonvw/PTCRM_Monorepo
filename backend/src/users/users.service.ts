import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Subscription } from 'src/payment/entities/subscription.entity';
import { PaymentService } from 'src/payment/payment.service';
import { PASSWORD_SALT_ROUNDS } from 'src/utils/constants';
import { Not, Repository } from 'typeorm';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignUpResponseDto } from './dtos/SignUpResponse.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { User } from './entities/user.entity';

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
  async create(body: SignUpDto): Promise<SignUpResponseDto> {
    const user = new User({
      ...body,
      subscription: { id: body?.subscription } as Subscription,
    });

    // Check if the user already exists
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException(
        'There is already a user registered with this email.',
      );
    }

    user.password = await bcrypt.hash(user.password, PASSWORD_SALT_ROUNDS);

    //. Save the user in the database
    const savedUser = await this.userRepository.save(user);

    const checkoutHref =
      await this.paymentService.updateInitialUserSubscription(
        user.subscription.id,
        savedUser.id,
      );

    return { checkoutHref };
  }

  async updateLoggedInUser(id: number, body: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: body.email, id: Not(id) },
    });

    if (existingUser) {
      throw new ConflictException(
        'There is already a user registered with this email.',
      );
    }

    const updatedUser = new User({ ...user, ...body });

    return await this.userRepository.save(updatedUser);
  }

  async getLoggedInUser(userId: number) {
    const user = await this.findById(userId);
    delete user.password;

    return user;
  }
}
