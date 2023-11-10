import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from '../login/enums/auth-type.enum';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { RegisterOrganizerUserDto } from './dto/register-organizer-user.dto';
import { RegisterTeamUserDto } from './dto/register-team-user.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  public async register(
    @Body() registerUserDto: RegisterTeamUserDto,
  ): Promise<any> {
    try {
      await this.registerService.register(registerUserDto);

      return {
        message: 'User registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not registration!');
    }
  }

  // store reg controller

  @Post('/organizer')
  public async registerCarOwnerUser(
    @Body() registerCarOwnerUserDto: RegisterOrganizerUserDto,
    @Query('ref') ref: string,
  ): Promise<any> {
    try {
      await this.registerService.registerCarOwnerUser(
        registerCarOwnerUserDto,
        ref,
      );

      return {
        message: 'car owner user registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(
        err,
        'Error: car owner user not registration!',
      );
    }
  }
}
