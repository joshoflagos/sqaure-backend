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
import { TeamUserService } from './team-user.service';
import { CreateTeamUserDto } from './dto/create-team-user.dto';
import { UpdateTeamUserDto } from './dto/update-team-user.dto';
import { TeamUserProfileDto } from './dto/team-user-profile.dto';
import { ITeamUsers } from './interfaces/team-user.interface';

@Controller('team-user')
export class TeamUserController {
  constructor(private readonly TeamUserService: TeamUserService) {}

  @Post()
  create(@Body() createTeamUserDto: CreateTeamUserDto) {
    return this.TeamUserService.create(createTeamUserDto);
  }

  @Get()
  findAll() {
    return this.TeamUserService.findAll();
  }

  @Get()
  public async findAllPassenger(): Promise<ITeamUsers[]> {
    return this.TeamUserService.findAll();
  }

  @Get('/:userId')
  public async findOnePassenger(
    @Param('userId') userId: string,
  ): Promise<ITeamUsers> {
    return this.TeamUserService.findById(userId);
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
    @Body() userProfileDto: TeamUserProfileDto,
  ): Promise<any> {
    try {
      await this.TeamUserService.updateProfilePassenger(
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
    @Body() userUpdateDto: UpdateTeamUserDto,
  ) {
    try {
      await this.TeamUserService.updatePassenger(userId, userUpdateDto);

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
  //     await this.TeamUserService.uploadImage(uploadProfilePicDto);
  //   } catch (err) {
  //     throw new BadRequestException(err, 'Error: passenger not updated!');
  //   }
  // }

  @Delete('/:userId')
  public async deletePassenger(@Param('userId') userId: string): Promise<void> {
    await this.TeamUserService.deletePassenger(userId);
  }
}
