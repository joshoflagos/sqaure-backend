import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ChangePasswordService } from './change-password.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { AuthType } from '../login/enums/auth-type.enum';
import { ChangeOrganizerPasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/change-password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post()
  // public async changePassword(
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ): Promise<any> {
  //   try {
  //     await this.changePasswordService.changePassword(changePasswordDto);

  //     return {
  //       message: 'Request Change Password Successfully!',
  //       status: HttpStatus.OK,
  //     };
  //   } catch (err) {
  //     console.log({ err });

  //     throw new BadRequestException(err, 'Error: Change password failed!');
  //   }
  // }
  @Post('/organizer')
  public async changeStorePassword(
    @Body() changePasswordDto: ChangeOrganizerPasswordDto,
  ): Promise<any> {
    return await this.changePasswordService.changeStorePassword(
      changePasswordDto,
    );
  }
}
