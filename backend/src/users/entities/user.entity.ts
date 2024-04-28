import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

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
}
