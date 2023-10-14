import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizer } from './entities/organizer.entity';
import { Repository } from 'typeorm';
import { OrganizerUserService } from '../organizer-user/organizer-user.service';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectRepository(Organizer)
    private organizerRepository: Repository<Organizer>,
    private readonly organizerUserService: OrganizerUserService,
  ) {}
  async create(createOrganizerDto: CreateOrganizerDto) {
    try {
      const getUser = await this.organizerUserService.findById(
        createOrganizerDto.organizer_user,
      );

      if (!getUser) {
        throw new HttpException('No user available', HttpStatus.BAD_REQUEST);
      } else {
        createOrganizerDto.organizer_user = getUser;
        const create = this.organizerRepository.create(createOrganizerDto);
        const savetoDb = await this.organizerRepository.save(create);

        if (!savetoDb) {
          throw new HttpException(
            'Unable to save Organizer data',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const responseData = {
            message: 'Organizer created successfully',
            data: savetoDb,
          };
          return responseData;
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const getall = await this.organizerRepository.find({
        relations: { organizer_user: true },
        order: { created_at: 'DESC' },
      });
      if (!getall) {
        throw new HttpException('No data available', HttpStatus.BAD_REQUEST);
      } else {
        return getall;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findByIds(ids: string[]) {
    try {
      const queryBuilder = this.organizerRepository
        .createQueryBuilder('organizer')
        .whereInIds(ids);

      const entities = await queryBuilder.getMany();
      console.log({ entities });

      if (!entities) {
        throw new HttpException('No data available', HttpStatus.BAD_REQUEST);
      } else {
        return entities;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByUserId(userId: string) {
    try {
      const getall = await this.organizerRepository.find({
        where: { organizer_user: { id: userId } },
        relations: { organizer_user: true },
        order: { created_at: 'DESC' },
      });
      if (!getall) {
        throw new HttpException('No data available', HttpStatus.BAD_REQUEST);
      } else {
        return getall;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string) {
    try {
      if (id == null || id == undefined) {
        throw new HttpException(
          `No manager id found ${id}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const getOne = await this.organizerRepository.findOne({
          where: { id },
          relations: { organizer_user: true },
        });
        console.log({ getOne });

        if (!getOne && getOne == null) {
          throw new HttpException(
            `No data availabe for this id ${id}`,
            HttpStatus.NOT_FOUND,
          );
        }
        return getOne;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
  async findOne(id: string) {
    try {
      if (id == null || id == undefined) {
        throw new HttpException(
          `No manager id found ${id}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const getOne = await this.organizerRepository.findOne({
          where: { id },
          relations: { organizer_user: true },
        });
        console.log({ getOne });

        if (!getOne && getOne == null) {
          throw new HttpException(
            `No data availabe for this id ${id}`,
            HttpStatus.NOT_FOUND,
          );
        }
        return getOne;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateOrganizerDto: UpdateOrganizerDto) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const getExistingData = await this.organizerRepository.findOne({
          where: { id },
        });
        if (!getExistingData && getExistingData == null) {
          throw new HttpException(
            `No record available for this ${id} `,
            HttpStatus.NOT_FOUND,
          );
        } else {
          const updateData = await this.organizerRepository.update(
            { id: getExistingData?.id },
            { ...updateOrganizerDto },
          );
          // console.log({ updateData });

          if (!updateData) {
            throw new HttpException(
              { message: 'Unable to update your data' },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const responseData = {
              message: 'Manager updated successfully',
              data: updateData,
            };
            return responseData;
          }
        }
      }
    } catch (error) {
      console.log({ error });

      throw new HttpException({ message: error }, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const findDataToDelete = await this.organizerRepository.findOne({
          where: { id },
        });
        if (!findDataToDelete) {
          throw new HttpException(
            { message: `No data Available for this id: ${id}` },
            HttpStatus.EXPECTATION_FAILED,
          );
        } else {
          const deleteData = await this.organizerRepository.softRemove(
            findDataToDelete,
          );

          if (!deleteData) {
            throw new HttpException(
              { message: 'Unable to delete your data please try again' },
              HttpStatus.EXPECTATION_FAILED,
            );
          } else {
            const responseData = {
              message: 'Manager   deleted successfully',
              data: deleteData,
            };
            return responseData;
          }
        }
      }
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
