import { ClientGoal } from 'src/client-goals/entities/client-goal.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Subscription } from 'src/payment/entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Client extends AbstractEntity<Client> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

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

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  paymentToken: string;

  @Column({ nullable: true })
  signupToken: string;

  //. This user is the coach of the client.
  @ManyToOne((type) => User)
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Subscription)
  @JoinColumn()
  subscription: Subscription;

  @OneToMany((type) => ClientGoal, (clientGoal) => clientGoal.client)
  clientGoals: ClientGoal[];

  // @ManyToOne(() => User, (user) => user.clients)
  // user: User;
}
