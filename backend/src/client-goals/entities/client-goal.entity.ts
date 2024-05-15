import { ClientGoalAchievement } from 'src/client-goal-achievement/entities/client-goal-achievement.entity';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'client_goal' })
export class ClientGoal extends AbstractEntity<ClientGoal> {
  @Column()
  startValue: number;

  @Column()
  currentValue: number;

  @Column()
  completedValue: number;

  @Column()
  completed: boolean = false;

  //. A client can have multiple client goals, but a client goal can only belong to one client.
  @ManyToOne(() => Client, (client) => client.clientGoals)
  client: Client;

  //. A client goal can have only one goal, but I don't want goals to contain client goals, which is why I'm using a one-way relationship here.
  @ManyToOne(() => Goal, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  goal: Goal;

  @OneToMany(
    () => ClientGoalAchievement,
    (clientGoalAchievement) => clientGoalAchievement.clientGoal,
  )
  achievements: ClientGoalAchievement[];
}
