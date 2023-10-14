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
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  manager_first_name: string;
  @Column()
  manager_last_name: String;
  @Column({ unique: true })
  email: string;
  @Column()
  gender: string;
  @Column()
  nin: string;
  @Column()
  bvn: string;
  @Column()
  phone_1: string;
  @Column({ nullable: true })
  phone_2: string;
  @Column()
  bank_account_number: string;
  @Column()
  bank_name: string;
  @Column()
  bank_account_name: string;
  @Column()
  address: string;
  @Column({ nullable: true })
  passport_url: string;
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
