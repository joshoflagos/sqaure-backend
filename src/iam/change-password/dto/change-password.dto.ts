import { PickType } from '@nestjs/swagger';
import { CreateOrganizerUserDto } from 'src/organizer-user/dto/create-organizer-user.dto';

// export class ChangePasswordDto extends PickType(PassengerDto, [
//   'reset_token',
//   'password',
// ] as const) {}

export class ChangeOrganizerPasswordDto extends PickType(
  CreateOrganizerUserDto,
  ['reset_token', 'password'] as const,
) {}
