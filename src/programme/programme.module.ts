import { Module } from '@nestjs/common';
import { ProgrammeService } from './programme.service';
import { ProgrammeController } from './programme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from './entities/programme.entity';
import { ManagerModule } from 'src/manager/manager.module';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { OrganizerUserModule } from 'src/organizer-user/organizer-user.module';
import { Participant } from 'src/participant/entities/participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Programme, Participant]),
    ManagerModule,
    OrganizerModule,
    OrganizerUserModule,
  ],
  controllers: [ProgrammeController],
  providers: [ProgrammeService],
  exports: [ProgrammeService],
})
export class ProgrammeModule {}
