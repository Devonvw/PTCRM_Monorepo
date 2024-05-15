import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Invoice } from './invoice.entity';

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

  @Column({ default: false })
  paid: boolean;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date;

  @OneToOne((type) => Invoice, (invoice) => invoice.payment)
  @JoinColumn() // this decorator is optional for @ManyToOne, but required for @OneToOne
  invoice: Invoice;

  @ManyToOne((type) => Subscription)
  @JoinColumn()
  subscription: Subscription;
}
