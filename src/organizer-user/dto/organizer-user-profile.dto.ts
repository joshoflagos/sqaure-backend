import { OmitType } from '@nestjs/swagger';
import { CreateOrganizerUserDto } from './create-organizer-user.dto';

export class OrganizerUserProfileDto extends OmitType(CreateOrganizerUserDto, [
  'password',
  'ref',
] as const) {}
