import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordService } from '../forgot-password/forgot-password.service';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { AuthType } from '../login/enums/auth-type.enum';
import { ForgotOrganizerPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  // @Post()
  // public async forgotPassword(
  //   @Body() forgotPasswordDto: ForgotPasswordDto,
  // ): Promise<any> {
  //   try {
  //     return await this.forgotPasswordService.forgotPassword(forgotPasswordDto);
  //   } catch (err) {
  //     console.error(err);
  //     throw new BadRequestException(err, 'Error: Forgot password failed!');
  //   }
  // }

  @Post('/carowner')
  public async forgotStorePassword(
    @Body() forgotStorePasswordDto: ForgotOrganizerPasswordDto,
  ): Promise<any> {
    return await this.forgotPasswordService.forgotStorePassword(
      forgotStorePasswordDto,
    );
  }
}
