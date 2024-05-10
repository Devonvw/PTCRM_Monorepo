import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Assessment } from "src/assessments/entities/assessment.entity";
import { ClientGoal } from "src/client-goals/entities/client-goal.entity";
import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: 'measurement'})
export class Measurement extends AbstractEntity<Measurement> {
  //. If an assessment is deleted, than all measurements related to that assessment should be deleted as well.
  @ManyToOne(() => Assessment, (assessment) => assessment.measurements, {onDelete: 'CASCADE'})
  assessment: Assessment;

  //. If a client goal is deleted, than all measurements related to that client goal should be deleted as well.
  @ManyToOne(() => ClientGoal, {onDelete: 'CASCADE'})
  clientGoal: ClientGoal;

  @Column()
  @IsNumber({}, {message: 'Value must be a number'})
  @Type(() => Number)
  @IsNotEmpty({message: 'Value is required'})
  value: number;
}