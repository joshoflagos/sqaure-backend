import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { ProgrammeService } from '../programme/programme.service';
import { CheckincheckoutTokenService } from 'src/checkincheckout-token/checkincheckout-token.service';
import { ManagerService } from '../manager/manager.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly organizerUserService: OrganizerUserService,
    private readonly programmeService: ProgrammeService,
    private readonly checkinoutTokenService: CheckincheckoutTokenService,
    private readonly managerService: ManagerService,
  ) {}
  async create(createParticipantDto: CreateParticipantDto) {
    try {
      const getManager = await this.managerService.findById(
        createParticipantDto.manager,
      );

      if (!getManager) {
        throw new HttpException('No user available', HttpStatus.BAD_REQUEST);
      } else {
        const getProgramme = await this.programmeService.findById(
          createParticipantDto.programme,
        );
        if (!getProgramme) {
          throw new HttpException(
            'No programmed available',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          createParticipantDto.manager = getManager;
          // createParticipantDto.organizer_user = getUser;
          createParticipantDto.programme = getProgramme;
          createParticipantDto.check_in =
            this.checkinoutTokenService.generateRandom4DigitNumber();
          createParticipantDto.check_out =
            this.checkinoutTokenService.generateRandom4DigitNumber();
          const create =
            this.participantRepository.create(createParticipantDto);
          const savetoDb = await this.participantRepository.save(create);

          if (!savetoDb) {
            throw new HttpException(
              'Unable to save Participant data',
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const responseData = {
              message: 'Participant created successfully',
              data: savetoDb,
            };
            return responseData;
          }
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all participant`;
  }

  async findAllByUserId(userId: string) {
    try {
      const getall = await this.participantRepository.find({
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
  async findAllByProgrammeId(programmeId: string) {
    try {
      const getall = await this.participantRepository.find({
        where: { programme: { id: programmeId } },
        relations: { organizer_user: true, programme: true, manager: true },
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
        const getOne = await this.participantRepository.findOne({
          where: { id },
          relations: { organizer_user: true, programme: true, manager: true },
        });

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
        const getOne = await this.participantRepository.findOne({
          where: { id },
          relations: { organizer_user: true, programme: true, manager: true },
        });

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

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const getExistingData = await this.participantRepository.findOne({
          where: { id },
        });
        if (!getExistingData && getExistingData == null) {
          throw new HttpException(
            `No record available for this ${id} `,
            HttpStatus.NOT_FOUND,
          );
        } else {
          const updateData = await this.participantRepository.update(
            { id: getExistingData?.id },
            { ...updateParticipantDto },
          );

          if (!updateData) {
            throw new HttpException(
              { message: 'Unable to update your data' },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const responseData = {
              message: 'Participant data updated successfully',
              data: updateData,
            };
            return responseData;
          }
        }
      }
    } catch (error) {
      // console.log({ error });

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
        const findDataToDelete = await this.participantRepository.findOne({
          where: { id },
        });
        if (!findDataToDelete) {
          throw new HttpException(
            { message: `No data Available for this id: ${id}` },
            HttpStatus.EXPECTATION_FAILED,
          );
        } else {
          const deleteData = await this.participantRepository.softRemove(
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
