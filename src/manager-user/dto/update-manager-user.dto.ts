import { PartialType } from '@nestjs/swagger';
import { CreateManagerUserDto } from './create-manager-user.dto';

export class UpdateManagerUserDto extends PartialType(CreateManagerUserDto) {}
