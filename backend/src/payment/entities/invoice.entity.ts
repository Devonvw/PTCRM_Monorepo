import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Payment } from './payment.entity';

@Entity()
export class Invoice extends AbstractEntity<Invoice> {
  @Column()
  name: string;

  @Column()
  trainingDays: number;

  @Column()
  fileKey: string;

  @OneToOne((type) => Payment, (payment) => payment.invoice)
  payment: Payment;
}
