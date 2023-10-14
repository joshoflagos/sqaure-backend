import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManagerUserDto } from './dto/create-manager-user.dto';
import { UpdateManagerUserDto } from './dto/update-manager-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerUser } from './entities/manager-user.entity';
import { IManagerUsers } from './interfaces/manager-user.interface';
import { ManagerUserProfileDto } from './dto/manager-user-profile.dto';

@Injectable()
export class ManagerUserService {
  constructor(
    @InjectRepository(ManagerUser)
    private readonly userRepository: Repository<ManagerUser>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<ManagerUser[]> {
    return await this.userRepository.find();
  }

  public async findByEmail(email: string): Promise<ManagerUser> {
    const passenger = await this.userRepository.findOneBy({
      email: email,
    });

    if (!passenger) {
      throw new NotFoundException(`passenger not found`);
    }

    return passenger;
  }

  public async findBySub(sub: string): Promise<ManagerUser> {
    const passenger = await this.userRepository.findOneByOrFail({
      id: sub,
    });

    if (!passenger) {
      throw new NotFoundException(`passenger not found`);
    }

    return passenger;
  }

  public async findById(userId: string): Promise<ManagerUser> {
    const passenger = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!passenger) {
      throw new NotFoundException(`passenger #${userId} not found`);
    }
    delete passenger.password;
    return passenger;
  }

  public async create(userDto: UpdateManagerUserDto): Promise<IManagerUsers> {
    try {
      return await this.userRepository.save(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<ManagerUser> {
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
  ): Promise<ManagerUser> {
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
    userProfileDto: ManagerUserProfileDto,
  ): Promise<ManagerUser> {
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
    userUpdateDto: UpdateManagerUserDto,
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
