import { Manager } from 'src/manager/entities/manager.entity';
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
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  dob: string;
  @Column()
  gender: string;
  @Column({ nullable: true })
  event_image_url: string;
  @Column()
  first_name: string;
  @Column({ nullable: true })
  middle_name: string;
  @Column()
  last_name: string;
  @Column()
  email: string;
  @Column()
  phone_number: string;
  @Column({ nullable: true })
  phone_number2: string;
  @Column()
  nin: string;
  @Column()
  bvn: string;
  @Column()
  address: string;
  @Column()
  place: string;

  @Column({ nullable: true, default: false })
  isCheck_in: boolean;
  @Column({ nullable: true, default: false })
  isCheck_out: boolean;
  @Column({ nullable: true, unique: true })
  check_out: number;
  @Column({ nullable: true, unique: true })
  check_in: number;
  @ManyToOne(() => OrganizerUser, (organizer_user) => organizer_user, {
    nullable: true,
  })
  @JoinColumn()
  organizer_user: OrganizerUser;
  @ManyToOne(() => Programme, (programme) => programme)
  @JoinColumn()
  programme: Programme;
  @ManyToOne(() => Manager, (manager) => manager, { nullable: true })
  @JoinColumn()
  manager: Manager;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
