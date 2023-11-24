import { Module } from '@nestjs/common';
import { ProgrammeService } from './programme.service';
import { ProgrammeController } from './programme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from './entities/programme.entity';
import { TeamModule } from 'src/team/team.module';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { Participant } from 'src/participant/entities/participant.entity';
import { MailerModule } from 'src/shared/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Programme, Participant]),
    TeamModule,
    OrganizerModule,
    OrganizerUserModule,
    MailerModule
  ],
  controllers: [ProgrammeController],
  providers: [ProgrammeService],
  exports: [ProgrammeService],
})
export class ProgrammeModule {}
