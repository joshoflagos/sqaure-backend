import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ManagerUserService } from './manager-user.service';
import { CreateManagerUserDto } from './dto/create-manager-user.dto';
import { UpdateManagerUserDto } from './dto/update-manager-user.dto';
import { ManagerUserProfileDto } from './dto/manager-user-profile.dto';
import { IManagerUsers } from './interfaces/manager-user.interface';

@Controller('manager-user')
export class ManagerUserController {
  constructor(private readonly managerUserService: ManagerUserService) {}

  @Post()
  create(@Body() createManagerUserDto: CreateManagerUserDto) {
    return this.managerUserService.create(createManagerUserDto);
  }

  @Get()
  findAll() {
    return this.managerUserService.findAll();
  }

  @Get()
  public async findAllPassenger(): Promise<IManagerUsers[]> {
    return this.managerUserService.findAll();
  }

  @Get('/:userId')
  public async findOnePassenger(
    @Param('userId') userId: string,
  ): Promise<IManagerUsers> {
    return this.managerUserService.findById(userId);
  }

  @Get('/:userId/profile')
  public async getPassenger(@Param('userId') userId: string): Promise<any> {
    const passenger = await this.findOnePassenger(userId);

    if (!passenger) {
      throw new NotFoundException('passenger does not exist!');
    }

    return {
      passenger: passenger,
      status: HttpStatus.OK,
    };
  }

  @Put('/:userId/profile')
  public async updateProfilePassenger(
    @Param('userId') userId: string,
    @Body() userProfileDto: ManagerUserProfileDto,
  ): Promise<any> {
    try {
      await this.managerUserService.updateProfilePassenger(
        userId,
        userProfileDto,
      );

      return {
        message: 'passenger Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: passenger not updated!');
    }
  }

  @Put('/:userId')
  public async updatePassenger(
    @Param('userId') userId: string,
    @Body() userUpdateDto: UpdateManagerUserDto,
  ) {
    try {
      await this.managerUserService.updatePassenger(userId, userUpdateDto);

      return {
        message: 'passenger Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: passenger not updated!');
    }
  }
  // @Post('/profile-upload')
  // public async uploadImage(
  //   @Body() uploadProfilePicDto: PassengerUploadProfilePicDto,
  // ) {
  //   try {
  //     await this.managerUserService.uploadImage(uploadProfilePicDto);
  //   } catch (err) {
  //     throw new BadRequestException(err, 'Error: passenger not updated!');
  //   }
  // }

  @Delete('/:userId')
  public async deletePassenger(@Param('userId') userId: string): Promise<void> {
    await this.managerUserService.deletePassenger(userId);
  }
}
