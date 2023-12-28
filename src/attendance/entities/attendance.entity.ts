import { Participant } from "src/participant/entities/participant.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => Participant, (participant) => participant.attendance)
    @JoinColumn()
    participant: Participant;

    @Column()
    attendance_selfie: string

    @Column()
    is_punctual: boolean;

    @Column()
    status: string

    @CreateDateColumn()
    clock_in_time: Date;

    @UpdateDateColumn()
    clock_out_time: Date;

    @Column({nullable:true})
    date:string

}
