import { Team } from 'src/team/entities/team.entity';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { Programme } from 'src/programme/entities/programme.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({nullable:true})
  title: string;
  @Column({nullable:true})
  surname: string;
  @Column({nullable:true})
  firstname: string;
  @Column({nullable:true})
  lastname: string;
  @Column({nullable:true})
  gender: string;
  @Column({nullable:true})
  email: string;
  @Column({nullable:true})
  phone_1: string;
  @Column({ nullable: true })
  phone_2: string;

  @Column({nullable:true})
  bank_account_name: string;

  @Column({nullable:true})
  bank_account_number: string;

  @Column({nullable:true})
  bank_name: string;
  @Column({nullable:true})
  organization: string;

  @ManyToOne(() => Programme, (programme) => programme, { onDelete: 'SET NULL' })
  @JoinColumn()
  programme: Programme;

  @OneToMany(()=>Attendance,attendance=>attendance.participant,{nullable:true})
  attendance:Attendance[] 

  @Column({nullable:true}) 
  attendance_pin: number;

  @Column({nullable:true,default:''})
  attendance_selfie: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({nullable:true,default:'https://app.gemoo.com/share/image-annotation/580492131280699392?codeId=vz8E7VOnpql8n&origin=imageurlgenerator'})
  reg_selfie: string;
}
