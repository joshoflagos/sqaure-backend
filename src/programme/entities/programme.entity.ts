import { Manager } from 'src/manager/entities/manager.entity';
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

  @Column()
  full_name: string;
  @Column()
  description: string;
  @Column()
  start_date: string;
  @Column()
  end_date: string;
  @Column({ nullable: true, default: 0 })
  participant_allowance: string;
  @Column({ nullable: true, default: 0 })
  manager_allowance: string;
  @Column({ nullable: true, default: 0 })
  participant_rate: string;
  @Column({ nullable: true, default: 0 })
  participant_distance: string;
  @Column({ nullable: true, default: 0 })
  manager_rate: string;
  @Column({ nullable: true, default: 0 })
  manager_distance: string;
  @Column()
  venue: string;
  @Column({ nullable: true })
  event_image_url: string;
  @Column({ nullable: true })
  attachement_programme: string;

  @ManyToMany(() => Manager, (manager) => manager)
  @JoinTable()
  manager: Manager[];
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
