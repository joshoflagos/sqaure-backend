import { Team } from 'src/team/entities/team.entity';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { Organizer } from 'src/organizer/entities/organizer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Programme {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({nullable:true})
  presence_type: string;
  @Column({nullable:true})
  name: string;
  @Column({nullable:true})
  work_order_id: string;
  @Column()
  start_date: string;
  @Column()
  end_date: string;
  @Column({ nullable: true, default: 0 })
  participant_allowance: string;
  @Column({ nullable: true, default: 0 })
  participant_airtime: string;
  @Column({ nullable: true, default: 0 })
  participant_rate: string;
  @Column({ nullable: true, default: 0 })
  participant_distance: string;

  @Column()
  venue: string;
  @Column({ nullable: true })
  event_attachement_programme: string;
  @Column({ nullable: true })
  agenda_attachement_programme: string;
  @Column({ nullable: true })
  budget_attachement_programme: string;
  @Column({ nullable: true })
  other_attachement_programme: string;



  @ManyToMany(() => Team, (team) => team)
  @JoinTable()
  team: Team[];
  @ManyToMany(() => Organizer, (organizer) => organizer)
  @JoinTable()
  organizer: Organizer[];
  @ManyToOne(() => OrganizerUser, (organizer_user) => organizer_user)
  @JoinColumn()
  organizer_user: OrganizerUser;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
