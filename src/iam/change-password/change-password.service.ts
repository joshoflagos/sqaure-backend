import { Injectable, Logger } from '@nestjs/common';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { ChangeOrganizerPasswordDto } from './dto/change-password.dto';

@Injectable()
export class ChangePasswordService {
  constructor(
    // private readonly passengerService: PassengersService,
    private readonly CarOwnerUsersService: OrganizerUserService,
  ) {}

  // public async changePassword(
  //   changePasswordDto: ChangePasswordDto,
  // ): Promise<any> {
  //   return await this.passengerService.updateByPassword(
  //     changePasswordDto.reset_token,
  //     changePasswordDto.password,
  //   );
  // }

  public async changeStorePassword(
    changePasswordDto: ChangeOrganizerPasswordDto,
  ): Promise<any> {
    return await this.CarOwnerUsersService.updateByPassword(
      changePasswordDto.reset_token,
      changePasswordDto.password,
    );
  }
}
