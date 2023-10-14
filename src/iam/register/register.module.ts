import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { ManagerUserService } from 'src/manager-user/manager-user.service';
import { ManagerUser } from 'src/manager-user/entities/manager-user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizerUser, ManagerUser]),
    MailerModule,
  ],
  controllers: [RegisterController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    RegisterService,
    OrganizerUserService,
    ManagerUserService,
  ],
})
export class RegisterModule {}
