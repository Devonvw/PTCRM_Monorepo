import { ClientGoal } from "src/client-goals/entities/client-goal.entity";
import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, IsNull, ManyToOne } from "typeorm";

@Entity({name: 'client_goal_achievement'})
export class ClientGoalAchievement extends AbstractEntity<ClientGoalAchievement> {
  //. If a client goal is deleted then all client goal achievements related to that client goal should be deleted as well.
  @ManyToOne(() => ClientGoal, (clientGoal) => clientGoal.clientGoalAchievements, {onDelete: 'CASCADE'})
  clientGoal: ClientGoal;
  
  @Column()
  achieved: boolean;

  @Column({nullable: true})
  achievedAt?: Date = null;

  @Column()
  value: number;

  //TODO: Add measurement entity
  // @Column()
  // measurement?: Measurement

}