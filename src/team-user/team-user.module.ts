import { Module } from '@nestjs/common';
import { TeamUserService } from './team-user.service';
import { TeamUserController } from './team-user.controller';
import { BcryptService } from 'src/shared/hashing/bcrypt.service';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamUser } from './entities/team-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamUser])],
  controllers: [TeamUserController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    TeamUserService,
  ],
  exports: [TeamUserService],
})
export class TeamUserModule {}
