import { PickType } from '@nestjs/swagger';
import { CreateManagerDto } from './create-manager.dto';

export class LoginManagerDto extends PickType(CreateManagerDto, [
  'email',
  'auth_link',
] as const) {}
