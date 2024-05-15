import { AbstractEntity } from 'src/database/abstract.entity';
import { Subscription } from 'src/payment/entities/subscription.entity';
import { EnumRoles } from 'src/types/roles.enums';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  company: string;

  @Column({ nullable: true })
  mollieCustomerId: string;

  @Column({ default: false })
  hasMandate: boolean;

  @Column({ default: true })
  role: EnumRoles = EnumRoles.USER;

  @ManyToOne((type) => Subscription)
  @JoinColumn()
  subscription: Subscription;
}
