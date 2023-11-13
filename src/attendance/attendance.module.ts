import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { ProgrammeModule } from 'src/programme/programme.module';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { ParticipantModule } from 'src/participant/participant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    ProgrammeModule,
    MailerModule,
    ParticipantModule
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule {}
