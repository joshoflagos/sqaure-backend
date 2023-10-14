import { Module } from '@nestjs/common';
import { ManagerUserService } from './manager-user.service';
import { ManagerUserController } from './manager-user.controller';
import { BcryptService } from 'src/shared/hashing/bcrypt.service';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerUser } from './entities/manager-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerUser])],
  controllers: [ManagerUserController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ManagerUserService,
  ],
  exports: [ManagerUserService],
})
export class ManagerUserModule {}
