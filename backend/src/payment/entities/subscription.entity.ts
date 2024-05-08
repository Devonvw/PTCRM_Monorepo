import { AbstractEntity } from 'src/database/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Subscription extends AbstractEntity<Subscription> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  sessionsPerWeek: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  vatPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @ManyToOne((type) => User)
  @JoinColumn()
  user: User;
}
