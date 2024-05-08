import { AbstractEntity } from "src/database/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Goal extends AbstractEntity<Goal> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  howToMeasure: string;

  @Column()
  measurementUnit: string;

  @ManyToOne(() => User, (user) => user.goals)
  user: User;
}