import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity } from "typeorm";

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

  @Column({nullable: true})
  userId: number;
}