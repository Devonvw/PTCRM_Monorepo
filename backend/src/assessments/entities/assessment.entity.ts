import { Client } from 'src/clients/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'assessment' })
export class Assessment extends AbstractEntity<Assessment> {
  //. If a client is deleted then all assessments related to that client should be deleted as well.
  @ManyToOne(() => Client, (client) => client.assessments, {
    onDelete: 'CASCADE',
  })
  client: Client;

  @Column()
  performedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => Measurement, (measurement) => measurement.assessment, {
    cascade: true,
  })
  measurements: Measurement[];
}
