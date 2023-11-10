import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class TeamUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  reset_token: string;

  @Column({ nullable: true })
  ref: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, default: Date.now().toString() })
  created_at: string;

  @Column({ nullable: true, default: Date.now().toString() })
  last_updated_at: string;
  @Column({ nullable: true, default: Date.now().toString() })
  updated_at: string;

  @Column({ length: 60 })
  password: string;
}
