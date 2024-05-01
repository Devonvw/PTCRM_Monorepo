import { AbstractEntity } from 'src/database/abstract.entity';
import { EnumRoles } from 'src/types/roles.enums';
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

  @Column({default: true})
  role: EnumRoles = EnumRoles.USER;
}
