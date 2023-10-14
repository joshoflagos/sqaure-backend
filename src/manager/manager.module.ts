import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { CheckincheckoutTokenModule } from 'src/checkincheckout-token/checkincheckout-token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manager]),
    OrganizerUserModule,
    MailerModule,
    CheckincheckoutTokenModule,
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
