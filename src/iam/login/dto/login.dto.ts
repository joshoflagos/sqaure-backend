import { PickType } from '@nestjs/swagger';
import { CreateManagerUserDto } from 'src/manager-user/dto/create-manager-user.dto';
import { CreateOrganizerUserDto } from 'src/organizer-user/dto/create-organizer-user.dto';

export class LoginDto extends PickType(CreateManagerUserDto, [
  'email',
  'password',
] as const) {}

export class LoginOrganizerUserDto extends PickType(CreateOrganizerUserDto, [
  'email',
  'password',
] as const) {}
