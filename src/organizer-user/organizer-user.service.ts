import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizerUserDto } from './dto/create-organizer-user.dto';
import { UpdateOrganizerUserDto } from './dto/update-organizer-user.dto';
import { OrganizerUser } from './entities/organizer-user.entity';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrganizerUsers } from './interfaces/organizer-users.interface';
import { OrganizerUserProfileDto } from './dto/organizer-user-profile.dto';

@Injectable()
export class OrganizerUserService {
  constructor(
    @InjectRepository(OrganizerUser)
    private readonly OrganizerUserRepository: Repository<OrganizerUser>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<OrganizerUser[]> {
    return await this.OrganizerUserRepository.find();
  }

  public async dashboardMetric(): Promise<any> {
    const users = await this.OrganizerUserRepository.find();
    const currentTime = Date.now();
    const currentDate = new Date(currentTime);

    const startOfYesterday = currentTime - 86400000;
    const startOfToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ).getTime();

    const startOfWeek =
      currentTime - ((currentDate.getDay() + 6) % 7) * 86400000;
    const startOfThisWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay(),
    ).getTime();

    const startOfPreviousWeek = startOfThisWeek - 7 * 86400000;
    const startOfLastWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() - 7,
    ).getTime();

    const startOfThisMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getTime();
    const startOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    ).getTime();

    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    ).getTime();
    const startOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getTime();

    const startOfThisYear = new Date(currentDate.getFullYear(), 0, 1).getTime();
    const startOfNextYear = new Date(
      currentDate.getFullYear() + 1,
      0,
      1,
    ).getTime();

    const startOfLastYear = new Date(
      currentDate.getFullYear() - 1,
      0,
      1,
    ).getTime();
    const startOfCurrentYear = new Date(
      currentDate.getFullYear(),
      0,
      1,
    ).getTime();

    const today = users.filter(
      (user) => parseInt(user.created_at) >= startOfToday,
    ).length;
    const yesterday = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfYesterday &&
        parseInt(user.created_at) < startOfToday,
    ).length;
    const this_week = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfThisWeek &&
        parseInt(user.created_at) < startOfWeek,
    ).length;
    const last_week = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfLastWeek &&
        parseInt(user.created_at) < startOfThisWeek,
    ).length;
    const this_month = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfThisMonth &&
        parseInt(user.created_at) < startOfNextMonth,
    ).length;
    const last_month = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfLastMonth &&
        parseInt(user.created_at) < startOfCurrentMonth,
    ).length;
    const this_year = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfThisYear &&
        parseInt(user.created_at) < startOfNextYear,
    ).length;
    const last_year = users.filter(
      (user) =>
        parseInt(user.created_at) >= startOfLastYear &&
        parseInt(user.created_at) < startOfCurrentYear,
    ).length;
    const all_time = users.length;

    const metrics = {
      today,
      yesterday,
      this_week,
      last_week,
      this_month,
      last_month,
      this_year,
      last_year,
      all_time,
    };
    return {
      metrics: metrics,
      status: HttpStatus.OK,
    };
  }

  public async findByEmail(email: string): Promise<OrganizerUser> {
    const user = await this.OrganizerUserRepository.findOneBy({
      email: email,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  public async findBySub(sub: string): Promise<OrganizerUser> {
    const user = await this.OrganizerUserRepository.findOneByOrFail({
      id: sub,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  public async findById(userId: string): Promise<OrganizerUser> {
    const user = await this.OrganizerUserRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(
    userDto: CreateOrganizerUserDto,
  ): Promise<IOrganizerUsers> {
    try {
      const newCarOwnerUser = await this.OrganizerUserRepository.save(userDto);
      return newCarOwnerUser;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<OrganizerUser> {
    try {
      const user = await this.OrganizerUserRepository.findOneBy({
        email: email,
      });
      user.password = await this.hashingService.hash(
        Math.random().toString(36).slice(-8),
      );

      return await this.OrganizerUserRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    reset_token: string,
    password: string,
  ): Promise<OrganizerUser> {
    try {
      const user = await this.OrganizerUserRepository.findOneBy({
        reset_token: reset_token,
      });
      if (!user || user.reset_token == null || reset_token == null) {
        throw new HttpException('Invalid reset token', HttpStatus.UNAUTHORIZED);
      } else {
        user.password = await this.hashingService.hash(password);
        user.reset_token = null;
        return await this.OrganizerUserRepository.save(user);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateProfileCarOwnerUser(
    id: string,
    userProfileDto: OrganizerUserProfileDto,
  ): Promise<OrganizerUser> {
    try {
      const user = await this.OrganizerUserRepository.findOneBy({ id: id });
      user.email = userProfileDto.email;
      return await this.OrganizerUserRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateCarOwnerUser(
    id: string,
    userUpdateDto: UpdateOrganizerUserDto,
  ): Promise<UpdateResult> {
    try {
      const user = await this.OrganizerUserRepository.update(
        {
          id: id,
        },
        { ...userUpdateDto },
      );

      return user;
    } catch (err) {
      throw new BadRequestException('User not updated');
    }
  }

  public async deleteCarOwnerUser(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.OrganizerUserRepository.remove(user);
  }
}
