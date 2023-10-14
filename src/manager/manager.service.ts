import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Repository } from 'typeorm';
import { OrganizerUserService } from '../organizer-user/organizer-user.service';
import { CheckincheckoutTokenService } from '../checkincheckout-token/checkincheckout-token.service';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { LoginManagerDto } from './dto/login-manager.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    private readonly organizerUserService: OrganizerUserService,
    private readonly checkincheckoutTokenService: CheckincheckoutTokenService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    try {
      const getUser = await this.organizerUserService.findById(
        createManagerDto.organizer_user,
      );

      if (!getUser) {
        throw new HttpException('No user available', HttpStatus.BAD_REQUEST);
      } else {
        const getExistingEmail = await this.managerRepository.findOne({
          where: { email: createManagerDto.email },
        });

        if (getExistingEmail) {
          throw new HttpException(
            'Please email already exist. Please try again with another email or contact admin',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          createManagerDto.organizer_user = getUser;
          createManagerDto.auth_link =
            this.checkincheckoutTokenService.generateRandomString(6);
          // console.log(
          //   'http://localhost:3000/crm/managers/auth/${createManagerDto.auth_link}',
          //   `http://localhost:3000/crm/managers/auth/${createManagerDto.auth_link}`,
          // );

          const html = `
        <!DOCTYPE html>
      <html>
      <head>
          <title>Welcome to Square CRM for Oganizations</title>
      </head>
      <body>
          <p>Hi ${createManagerDto.manager_first_name}   ${
            createManagerDto.manager_last_name
          },</p>
      
          <p>Welcome to Square CRM for Oganizations </p>
      
          <p><strong> We help organisations plan and manage their programmes, managers, participants, attendance, travel and spend records.</strong>
          </p>
          <p>We help organization manage programmes sponsors, participant, travel and spend record 
          </p>   <p> I have created an account for you on Square CRM as a Manager. You can use this account to access a variety of resources, including adding participant, checking of available programmes.
          </p>
      
          <p><b>To log in to your account, please click on the following link:</b></p>
          <ul>
          <li> <a href=${`https://square-inky.vercel.app/crm/managers/auth/${createManagerDto.auth_link}`}>Click to Login</a></li>
          
  </ul>
      
          
          <p>COO,<br>
        Reuben Igba<br>
          </p>
  <p/>
  <hr/>
          <footer>
          <i>U6/1A Hilly Street, Mortlake NSW 2137, AUSTRALIA.</i>
          </footer>
      </body>
      </html>      
      `;

          const create = this.managerRepository.create(createManagerDto);
          const savetoDb = await this.managerRepository.save(create);

          if (!savetoDb) {
            throw new HttpException(
              'Unable to save manager data',
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const options = {
              email: createManagerDto.email,
              subject: 'Welcome to Square',
              html: html,
            };

            await this.mailerService.sendMail(options);

            const responseData = {
              message: 'Manager created successfully',
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

  async login(auth_link: string) {
    console.log({ auth_link });

    try {
      const getAuthLink = await this.managerRepository.findOne({
        where: { auth_link: auth_link },
      });
      console.log({ getAuthLink });

      if (!getAuthLink) {
        throw new HttpException(
          'Sorry invalid login details, please try again later!!',
          HttpStatus.NOT_FOUND,
        );
      } else {
        const responseData = {
          message: 'Login successfully',
          data: getAuthLink,
        };
        return responseData;
      }
    } catch (error) {
      console.log({ error });

      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async findByIds(ids: string[]) {
    try {
      const queryBuilder = this.managerRepository
        .createQueryBuilder('manager')
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

  async findAll() {
    try {
      const getall = await this.managerRepository.find({
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
      const getall = await this.managerRepository.find({
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
        const getOne = await this.managerRepository.findOne({
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
        const getOne = await this.managerRepository.findOne({
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

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const getExistingData = await this.managerRepository.findOne({
          where: { id },
        });
        if (!getExistingData && getExistingData == null) {
          throw new HttpException(
            `No record available for this ${id} `,
            HttpStatus.NOT_FOUND,
          );
        } else {
          const updateData = await this.managerRepository.update(
            { id: getExistingData?.id },
            { ...updateManagerDto },
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
        const findDataToDelete = await this.managerRepository.findOne({
          where: { id },
        });
        if (!findDataToDelete) {
          throw new HttpException(
            { message: `No data Available for this id: ${id}` },
            HttpStatus.EXPECTATION_FAILED,
          );
        } else {
          const deleteData = await this.managerRepository.softRemove(
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
