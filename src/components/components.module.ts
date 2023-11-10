import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Components } from './entities/components.entity';
import { ProgrammeModule } from 'src/programme/programme.module';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { TeamModule } from 'src/team/team.module';
import { CheckincheckoutTokenModule } from 'src/checkincheckout-token/checkincheckout-token.module';
import { MailerModule } from 'src/shared/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Components]),
    ProgrammeModule,
    OrganizerUserModule,
    TeamModule,
    CheckincheckoutTokenModule,
    MailerModule
  ],
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule { }
