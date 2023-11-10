import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import jwtConfig from './config/jwt.config';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { TeamUserService } from 'src/team-user/team-user.service';
import { TeamUser } from 'src/team-user/entities/team-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizerUser, TeamUser]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    LoginService,
    OrganizerUserService,
    TeamUserService,
  ],
  controllers: [LoginController],
})
export class LoginModule {}
