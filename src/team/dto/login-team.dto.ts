import { PickType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';

export class LoginTeamDto extends PickType(CreateTeamDto, [
  'project_coordinator_email',
  'auth_link',
] as const) {}
