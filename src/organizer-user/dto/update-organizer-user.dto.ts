import { PartialType } from '@nestjs/swagger';
import { CreateOrganizerUserDto } from './create-organizer-user.dto';

export class UpdateOrganizerUserDto extends PartialType(CreateOrganizerUserDto) {}
