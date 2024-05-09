import { ClientGoal } from "src/client-goals/entities/client-goal.entity";
import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: 'client_goal_achievement'})
export class ClientGoalAchievement extends AbstractEntity<ClientGoalAchievement> {
  @ManyToOne(() => ClientGoal, (clientGoal) => clientGoal.clientGoalAchievements)
  clientGoal: ClientGoal;
  
  @Column()
  achieved: boolean;

  @Column()
  achievedAt?: Date = null;

  @Column()
  value: number;

  //TODO: Add measurement entity
  // @Column()
  // measurement?: Measurement

}