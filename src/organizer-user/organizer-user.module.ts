import { Module } from '@nestjs/common';
import { OrganizerUserService } from './organizer-user.service';
import { OrganizerUserController } from './organizer-user.controller';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { BcryptService } from 'src/shared/hashing/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerUser } from './entities/organizer-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerUser])],
  controllers: [OrganizerUserController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    OrganizerUserService,
  ],
  exports: [OrganizerUserService],
})
export class OrganizerUserModule {}
