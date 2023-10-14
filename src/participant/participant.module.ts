import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { ProgrammeModule } from 'src/programme/programme.module';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { ManagerModule } from 'src/manager/manager.module';
import { CheckincheckoutTokenModule } from 'src/checkincheckout-token/checkincheckout-token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant]),
    ProgrammeModule,
    OrganizerUserModule,
    ManagerModule,
    CheckincheckoutTokenModule,
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
