import { OmitType } from '@nestjs/swagger';
import { CreateTeamUserDto } from './create-team-user.dto';

export class TeamUserProfileDto extends OmitType(CreateTeamUserDto, [
  'password',
] as const) {}
