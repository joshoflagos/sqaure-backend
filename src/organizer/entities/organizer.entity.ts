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
export class Organizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  phone_1: string;
  @Column({ nullable: true })
  phone_2: string;
  @Column()
  address: string;
  @Column({ nullable: true })
  banner_image_url: string;
  @ManyToOne(() => OrganizerUser, (organizer_user) => organizer_user)
  @JoinColumn()
  organizer_user: OrganizerUser;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
