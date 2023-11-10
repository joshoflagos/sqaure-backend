import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamUserDto } from './dto/create-team-user.dto';
import { UpdateTeamUserDto } from './dto/update-team-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { Repository, UpdateResult } from 'typeorm';
import { TeamUser } from './entities/team-user.entity';
import { ITeamUsers } from './interfaces/team-user.interface';
import { TeamUserProfileDto } from './dto/team-user-profile.dto';

@Injectable()
export class TeamUserService {
  constructor(
    @InjectRepository(TeamUser)
    private readonly userRepository: Repository<TeamUser>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<TeamUser[]> {
    return await this.userRepository.find();
  }

  public async findByEmail(email: string): Promise<TeamUser> {
    const passenger = await this.userRepository.findOneBy({
      email: email,
    });

    if (!passenger) {
      throw new NotFoundException(`passenger not found`);
    }

    return passenger;
  }

  public async findBySub(sub: string): Promise<TeamUser> {
    const passenger = await this.userRepository.findOneByOrFail({
      id: sub,
    });

    if (!passenger) {
      throw new NotFoundException(`passenger not found`);
    }

    return passenger;
  }

  public async findById(userId: string): Promise<TeamUser> {
    const passenger = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!passenger) {
      throw new NotFoundException(`passenger #${userId} not found`);
    }
    delete passenger.password;
    return passenger;
  }

  public async create(userDto: UpdateTeamUserDto): Promise<ITeamUsers> {
    try {
      return await this.userRepository.save(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<TeamUser> {
    try {
      const passenger = await this.userRepository.findOneBy({ email: email });
      passenger.password = await this.hashingService.hash(
        Math.random().toString(36).slice(-8),
      );

      return await this.userRepository.save(passenger);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    reset_token: string,
    password: string,
  ): Promise<TeamUser> {
    try {
      const passenger = await this.userRepository.findOneBy({
        reset_token: reset_token,
      });
      passenger.password = await this.hashingService.hash(password);

      return await this.userRepository.save(passenger);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateProfilePassenger(
    id: string,
    userProfileDto: TeamUserProfileDto,
  ): Promise<TeamUser> {
    try {
      const passenger = await this.userRepository.findOneBy({ id: id });
      passenger.email = userProfileDto.email;
      return await this.userRepository.save(passenger);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updatePassenger(
    id: string,
    userUpdateDto: UpdateTeamUserDto,
  ): Promise<UpdateResult> {
    try {
      const passenger = await this.userRepository.update(
        {
          id: id,
        },
        { ...userUpdateDto },
      );

      return passenger;
    } catch (err) {
      throw new BadRequestException('passenger not updated');
    }
  }

  // public async uploadImage(uploadProfilePicDto: PassengerUploadProfilePicDto) {
  //   try {
  //     const passenger = await this.userRepository.findOneBy({
  //       id: uploadProfilePicDto.id,
  //     });
  //     if (!passenger) {
  //       throw new HttpException(
  //         'No Passenger data available ',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     } else {
  //       passenger.portrait = uploadProfilePicDto.portrait;
  //       const saveUpload = await this.userRepository.save(passenger);
  //       if (!saveUpload) {
  //         throw new HttpException(
  //           'Unable to process your request, please try again ',
  //           HttpStatus.NOT_MODIFIED,
  //         );
  //       } else {
  //         const responseData = {
  //           message: 'Upload successful updated successfully',
  //           data: saveUpload,
  //         };
  //         return responseData;
  //       }
  //     }
  //   } catch (err) {
  //     throw new HttpException(err, HttpStatus.BAD_REQUEST);
  //   }
  // }

  public async deletePassenger(id: string): Promise<void> {
    const passenger = await this.findById(id);
    await this.userRepository.remove(passenger);
  }
}
