import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { CheckincheckoutTokenModule } from 'src/checkincheckout-token/checkincheckout-token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    OrganizerUserModule,
    MailerModule,
    CheckincheckoutTokenModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
