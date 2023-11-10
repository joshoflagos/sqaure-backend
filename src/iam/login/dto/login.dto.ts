import { PickType } from '@nestjs/swagger';
import { CreateTeamUserDto } from 'src/team-user/dto/create-team-user.dto';
import { CreateOrganizerUserDto } from 'src/organizer-user/dto/create-organizer-user.dto';

export class LoginDto extends PickType(CreateTeamUserDto, [
  'email',
  'password',
] as const) {}

export class LoginOrganizerUserDto extends PickType(CreateOrganizerUserDto, [
  'email',
  'password',
] as const) {}
