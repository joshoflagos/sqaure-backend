import { Team } from 'src/team/entities/team.entity';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { Programme } from 'src/programme/entities/programme.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Components {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  work_order_id: string;
  @Column({ nullable: true })
  work_order_name: string;
  @Column({ nullable: true })
  component_and_sub: string;
  @Column({ nullable: true })
  component_lead: string;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
