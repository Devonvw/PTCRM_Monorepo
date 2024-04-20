import { AbstractEntity } from 'src/database/abstract.entity';
import { Column } from 'typeorm';

export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
