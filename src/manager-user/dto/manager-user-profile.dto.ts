import { OmitType } from '@nestjs/swagger';
import { CreateManagerUserDto } from './create-manager-user.dto';

export class ManagerUserProfileDto extends OmitType(CreateManagerUserDto, [
  'password',
] as const) {}
