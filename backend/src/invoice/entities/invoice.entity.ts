import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Entity()
export class Invoice extends AbstractEntity<Invoice> {
  @Column()
  number: number;

  @OneToOne((type) => Payment, (payment) => payment.invoice)
  payment: Payment;

  @ManyToOne((type) => User)
  @JoinColumn()
  user: User;
}
