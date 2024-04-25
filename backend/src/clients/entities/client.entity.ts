import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

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
}
