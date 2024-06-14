import { Client } from 'src/clients/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Subscription } from 'src/payment/entities/subscription.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Goal } from 'src/goals/entities/goal.entity';
import { EnumRoles } from 'src/types/roles.enums';

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

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  housenumber: string;

  @Column({ nullable: true })
  housenumberExtra: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  mollieCustomerId: string;

  @Column({ default: false })
  hasMandate: boolean;

  @Column({ default: true })
  role: EnumRoles = EnumRoles.USER;

  @ManyToOne((type) => Subscription)
  @JoinColumn()
  subscription: Subscription;

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];
}
