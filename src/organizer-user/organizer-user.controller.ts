import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { OrganizerUserService } from './organizer-user.service';
import { CreateOrganizerUserDto } from './dto/create-organizer-user.dto';
import { UpdateOrganizerUserDto } from './dto/update-organizer-user.dto';
import { IOrganizerUsers } from './interfaces/organizer-users.interface';
import { OrganizerUserProfileDto } from './dto/organizer-user-profile.dto';

@Controller('organizer-user')
export class OrganizerUserController {
  constructor(private readonly organizerUserService: OrganizerUserService) {}

  @Get()
  public async findAllCarOwnerUser(): Promise<IOrganizerUsers[]> {
    return this.organizerUserService.findAll();
  }

  @Get('/admin/dashboard')
  public async dashboardMetric(): Promise<any> {
    return this.organizerUserService.dashboardMetric();
  }

  @Get('/:userId')
  public async findOneCarOwnerUser(
    @Param('userId') userId: string,
  ): Promise<IOrganizerUsers> {
    return this.organizerUserService.findById(userId);
  }

  @Get('/:userId/profile')
  public async getCarOwnerUser(@Param('userId') userId: string): Promise<any> {
    const user = await this.findOneCarOwnerUser(userId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return {
      user: user,
      status: HttpStatus.OK,
    };
  }

  @Put('/:userId/profile')
  public async updateProfileCarOwnerUser(
    @Param('userId') userId: string,
    @Body() userProfileDto: OrganizerUserProfileDto,
  ): Promise<any> {
    try {
      await this.organizerUserService.updateProfileCarOwnerUser(
        userId,
        userProfileDto,
      );

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Put('/:userId')
  public async updateCarOwnerUser(
    @Param('userId') userId: string,
    @Body() userUpdateDto: UpdateOrganizerUserDto,
  ) {
    try {
      await this.organizerUserService.updateCarOwnerUser(userId, userUpdateDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Delete('/:userId')
  public async deleteCarOwnerUser(
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.organizerUserService.deleteCarOwnerUser(userId);
  }
}
