import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilsModule } from '../shared/utils/utils.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';

@Module({
  imports: [
    LoginModule,
    RegisterModule,

    ForgotPasswordModule,
    ChangePasswordModule,
    UtilsModule,
    OrganizerUserModule,
  ],
  providers: [JwtService],
})
export class IamModule {}
