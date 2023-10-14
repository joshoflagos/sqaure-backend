import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProgrammeDto } from './dto/create-programme.dto';
import { UpdateProgrammeDto } from './dto/update-programme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Programme } from './entities/programme.entity';
import { In, Repository } from 'typeorm';
import { ManagerService } from '../manager/manager.service';
import { OrganizerService } from 'src/organizer/organizer.service';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { Participant } from 'src/participant/entities/participant.entity';

@Injectable()
export class ProgrammeService {
  constructor(
    @InjectRepository(Programme)
    private readonly programmeRepository: Repository<Programme>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly managerService: ManagerService,
    private readonly organizerService: OrganizerService,
    private readonly organizerUserService: OrganizerUserService,
  ) {}
  async create(createProgrammeDto: CreateProgrammeDto) {
    try {
      const getUser = await this.organizerUserService.findById(
        createProgrammeDto.organizer_user,
      );

      if (!getUser) {
        throw new HttpException('No user available', HttpStatus.BAD_REQUEST);
      } else {
        const getManager = await this.managerService.findByIds(
          createProgrammeDto.manager,
        );
        if (!getManager) {
          throw new HttpException(
            'Unable to get manager data',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const getOrganizer = await this.organizerService.findByIds(
            createProgrammeDto.organizer,
          );
          if (!getOrganizer) {
            throw new HttpException(
              'Unable to get manager data',
              HttpStatus.BAD_REQUEST,
            );
          } else {
            createProgrammeDto.organizer_user = getUser;
            createProgrammeDto.organizer = getOrganizer;
            createProgrammeDto.manager = getManager;
            const create = this.programmeRepository.create(createProgrammeDto);
            const savetoDb = await this.programmeRepository.save(create);

            if (!savetoDb) {
              throw new HttpException(
                'Unable to save manager data',
                HttpStatus.BAD_REQUEST,
              );
            } else {
              const responseData = {
                message: 'Programmed created successfully',
                data: savetoDb,
              };
              return responseData;
            }
          }
        }
      }
    } catch (error) {
      // console.log({ error });

      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const getall = await this.programmeRepository.find({
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

  async findAllByUserId(userId: string) {
    try {
      const getall = await this.programmeRepository.find({
        where: { organizer_user: { id: userId } },
        relations: { organizer_user: true, organizer: true, manager: true },
        order: { created_at: 'DESC' },
      });

      if (!getall) {
        throw new HttpException('No data available', HttpStatus.BAD_REQUEST);
      } else {
        const programIds = getall?.map((program) => program.id);

        const mapAlls = getall.map((programIds) =>
          this.countParticipant(programIds.id),
        );

        // Wait for all promises to resolve
        const counts = await Promise.all(mapAlls);
        // console.log({ counts });

        // const count = await this.countParticipant(programIds);
        return { getall, counts };
      }
    } catch (error) {
      // console.log({ error });

      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async findAllByManagerId(userId: string) {
    try {
      const getall = await this.programmeRepository.find({
        // where: { manager: { id: userId } },
        // where: { id: In([1, 2, 3]) },
        where: { manager: { id: In([userId]) } },
        relations: { organizer_user: true, organizer: true, manager: true },
        order: { created_at: 'DESC' },
      });

      if (!getall) {
        throw new HttpException('No data available', HttpStatus.BAD_REQUEST);
      } else {
        const programIds = getall?.map((program) => program.id);

        const mapAlls = getall.map((programIds) =>
          this.countParticipant(programIds.id),
        );

        // Wait for all promises to resolve
        const counts = await Promise.all(mapAlls);
        // console.log({ counts });

        // const count = await this.countParticipant(programIds);
        return { getall, counts };
      }
    } catch (error) {
      // console.log({ error });

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
        const getOne = await this.programmeRepository.findOne({
          where: { id },
          relations: { organizer_user: true },
        });
        // console.log({ getOne });

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
        const getOne = await this.programmeRepository.findOne({
          where: { id },
          relations: { organizer_user: true },
        });
        // console.log({ getOne });

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
  async countParticipantsForPrograms(programs: Programme[]) {
    const programIds = programs.map((program) => program.id);

    const participantCounts = await this.participantRepository
      .createQueryBuilder('participant')
      .select('participant.programmeId', 'programmeId')
      .addSelect('COUNT(participant.id)', 'count')
      .where('participant.programmeId IN (:...programIds)', { programIds })
      .groupBy('participant.programmeId')
      .getRawMany();

    // Convert the result into a dictionary with programId as the key and count as the value
    const participantCountMap = participantCounts.reduce((result, item) => {
      result[item.programmeId] = parseInt(item.count, 10); // Ensure the count is an integer
      return result;
    }, {});

    return participantCountMap;
  }
  async countParticipant(programid: any) {
    try {
      // console.log(programid);

      const count = await this.participantRepository.count({
        where: { programme: { id: programid } },
      });
      // console.log({ count });

      return count;
    } catch (error) {
      // console.log({ error });
    }
  }

  async update(id: string, updateProgrammeDto: UpdateProgrammeDto) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const getExistingData = await this.programmeRepository.findOne({
          where: { id },
          relations: ['organizer', 'manager'],
        });
        if (!getExistingData && getExistingData == null) {
          throw new HttpException(
            `No record available for this ${id} `,
            HttpStatus.NOT_FOUND,
          );
        } else {
          //  getExistingData.attachement_programme =
          //    updateProgrammeDto.attachement_programme;
          //  getExistingData.description = updateProgrammeDto.description;
          //  getExistingData.full_name = updateProgrammeDto.full_name;
          //  getExistingData.description = updateProgrammeDto.description;
          //  getExistingData.start_date = updateProgrammeDto.start_date;
          //  getExistingData.end_date = updateProgrammeDto.end_date;
          //  getExistingData.participant_allowance =
          //    updateProgrammeDto.participant_allowance;
          //  getExistingData.manager_allowance =
          //    updateProgrammeDto.manager_allowance;
          //  getExistingData.participant_rate =
          //    updateProgrammeDto.participant_rate;
          //  getExistingData.participant_distance =
          //    updateProgrammeDto.participant_distance;
          //  getExistingData.manager_rate = updateProgrammeDto.manager_rate;
          //  getExistingData.manager_distance =
          //    updateProgrammeDto.manager_distance;
          //  getExistingData.venue = updateProgrammeDto.venue;
          //  getExistingData.event_image_url = updateProgrammeDto.event_image_url;
          //  getExistingData.attachement_programme =
          //    updateProgrammeDto.attachement_programme;
          //  getExistingData.manager = updateProgrammeDto.manager;
          //  getExistingData.organizer = updateProgrammeDto.organizer;
          //  getExistingData.organizer_user;
          const updateData = await this.programmeRepository.update(
            { id: getExistingData?.id },
            { ...updateProgrammeDto },
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
        const findDataToDelete = await this.programmeRepository.findOne({
          where: { id },
        });
        if (!findDataToDelete) {
          throw new HttpException(
            { message: `No data Available for this id: ${id}` },
            HttpStatus.EXPECTATION_FAILED,
          );
        } else {
          const deleteData = await this.programmeRepository.softRemove(
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
