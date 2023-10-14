import { PickType } from '@nestjs/swagger';
import { CreateOrganizerUserDto } from 'src/organizer-user/dto/create-organizer-user.dto';

// export class ForgotPasswordDto extends PickType(PassengerDto, ['email'] as const) {}

export class ForgotOrganizerPasswordDto extends PickType(
  CreateOrganizerUserDto,
  ['email'] as const,
) {}
