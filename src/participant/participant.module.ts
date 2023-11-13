import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { ProgrammeModule } from 'src/programme/programme.module';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { TeamModule } from 'src/team/team.module';
import { CheckincheckoutTokenModule } from 'src/checkincheckout-token/checkincheckout-token.module';
import { MailerModule } from 'src/shared/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant]),
    ProgrammeModule,
    OrganizerUserModule,
    TeamModule,
    CheckincheckoutTokenModule,
    MailerModule
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports:[ParticipantService]
})
export class ParticipantModule { }
