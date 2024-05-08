import { Client } from 'src/clients/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { EnumRoles } from 'src/types/roles.enums';
import { Column, Entity, OneToMany } from 'typeorm';

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

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];
}
