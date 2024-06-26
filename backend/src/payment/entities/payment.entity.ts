import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { PaymentStatus } from '@mollie/api-client';

@Entity()
export class Payment extends AbstractEntity<Payment> {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  vatPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  molliePaymentId: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.open })
  status: PaymentStatus;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date;

  @Column({ default: false })
  isVerification: boolean;

  @Column({ nullable: true })
  molliePaymentUrl: string;

  @OneToOne((type) => Invoice, (invoice) => invoice.payment)
  @JoinColumn() // this decorator is optional for @ManyToOne, but required for @OneToOne
  invoice: Invoice;

  @ManyToOne((type) => Subscription)
  @JoinColumn()
  subscription: Subscription;

  @ManyToOne((type) => User)
  @JoinColumn()
  user: User;
}
