import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
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
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   @Column({nullable:true })
  programme_manager_first_name: string;
   @Column({nullable:true })
  programme_manager_last_name: String;
  @Column({ nullable:true })
  programme_manager_email: string;
  @Column({nullable:true })
  programme_manager_gender: string;
  @Column({nullable:true })
  programme_manager_phone_1: string;
  @Column({ nullable: true })
  programme_manager_phone_2: string;


   @Column({nullable:true })
  project_coordinator_first_name: string;
   @Column({nullable:true })
  project_coordinator_last_name: String;
  @Column({ unique: true,nullable:true })
  project_coordinator_email: string;
   @Column({nullable:true })
  project_coordinator_gender: string;
   @Column({nullable:true })
  project_coordinator_phone_1: string;
  @Column({ nullable: true })
  project_coordinator_phone_2: string;

   @Column({nullable:true })
  administrative_assistant_first_name: string;
   @Column({nullable:true })
  administrative_assistant_last_name: String;
  @Column({ nullable:true })
  administrative_assistant_email: string;
   @Column({nullable:true })
  administrative_assistant_gender: string;
   @Column({nullable:true })
  administrative_assistant_phone_1: string;
  @Column({ nullable: true })
  administrative_assistant_phone_2: string;

  @Column({ nullable: true })
  team_address: string;

  @Column({ nullable: true })
  auth_link: string;
  @ManyToOne(() => OrganizerUser, (organizer_user) => organizer_user)
  @JoinColumn()
  organizer_user: OrganizerUser;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 
