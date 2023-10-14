import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../shared/utils/utils.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';

import { MailerModule } from 'src/shared/mailer/mailer.module';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizerUser]),
    UtilsModule,
    MailerModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    OrganizerUserService,
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
