import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { OrganizerUserService } from '../organizer-user/organizer-user.service';
import { CheckincheckoutTokenService } from '../checkincheckout-token/checkincheckout-token.service';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { LoginTeamDto } from './dto/login-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly TeamRepository: Repository<Team>,
    private readonly organizerUserService: OrganizerUserService,
    private readonly checkincheckoutTokenService: CheckincheckoutTokenService,
    private readonly mailerService: MailerService,
  ) {}
 
  async create(createTeamDto: CreateTeamDto) {
    try {
      const getUser = await this.organizerUserService.findById(
        createTeamDto.organizer_user,
      );

      if (!getUser) {
        throw new HttpException('No user available', HttpStatus.BAD_REQUEST);
      } else {
        const getExistingEmail = await this.TeamRepository.findOne({
          where: { administrative_assistant_email: createTeamDto.administrative_assistant_email },
        });

        if (getExistingEmail) {
          throw new HttpException(
            'Please email already exist. Please try again with another email or contact admin',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          createTeamDto.organizer_user = getUser;
          createTeamDto.auth_link =
            this.checkincheckoutTokenService.generateRandomString(6);
          // console.log(
          //   'http://localhost:3000/crm/Teams/auth/${createTeamDto.auth_link}',
          //   `http://localhost:3000/crm/Teams/auth/${createTeamDto.auth_link}`,
          // );

          const html = `
        <!DOCTYPE html>
      <html>
      <head>
          <title>Welcome to IDEA INT for Oganizations</title>
      </head>
      <body>
          <p>Hi ${createTeamDto.administrative_assistant_first_name}   ${
            createTeamDto.administrative_assistant_last_name
          },</p>
      
          <p>Welcome to IDEA INT for Oganizations </p>
      
          <p><strong> We help organisations plan and manage their programmes, Teams, participants, attendance, travel and spend records.</strong>
          </p>
          <p>We help organization manage programmes sponsors, participant, travel and spend record 
          </p>   <p> I have created an account for you on IDEA INT as a Team. You can use this account to access a variety of resources, including adding participant, checking of available programmes.
          </p>
      
          <p><b>To log in to your account, please click on the following link:</b></p>
          <ul>
          <li> <a href=${`https://square-inky.vercel.app/crm/Teams/auth/${createTeamDto.auth_link}`}>Click to Login</a></li>
          
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

          const create = this.TeamRepository.create(createTeamDto);
          const savetoDb = await this.TeamRepository.save(create);

          if (!savetoDb) {
            throw new HttpException(
              'Unable to save team data',
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const options = {
              email: createTeamDto.administrative_assistant_email,
              subject: 'Welcome to Square',
              html: html,
            };

            await this.mailerService.sendMail(options);

            const responseData = {
              message: 'Team created successfully',
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
      const getAuthLink = await this.TeamRepository.findOne({
        where: { auth_link: auth_link },
      });
     

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
      const queryBuilder = this.TeamRepository
        .createQueryBuilder('team')
        .whereInIds(ids);

      const entities = await queryBuilder.getMany();
    

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
      const getall = await this.TeamRepository.find({
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
      const getall = await this.TeamRepository.find({
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
          `No team id found ${id}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const getOne = await this.TeamRepository.findOne({
          where: { id },
          relations: { organizer_user: true },
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
          `No team id found ${id}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const getOne = await this.TeamRepository.findOne({
          where: { id },
          relations: { organizer_user: true },
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

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const getExistingData = await this.TeamRepository.findOne({
          where: { id },
        });
        if (!getExistingData && getExistingData == null) {
          throw new HttpException(
            `No record available for this ${id} `,
            HttpStatus.NOT_FOUND,
          );
        } else {
          const updateData = await this.TeamRepository.update(
            { id: getExistingData?.id },
            { ...updateTeamDto },
          );
          // console.log({ updateData });

          if (!updateData) {
            throw new HttpException(
              { message: 'Unable to update your data' },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const responseData = {
              message: 'Team updated successfully',
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
        const findDataToDelete = await this.TeamRepository.findOne({
          where: { id },
        });
        if (!findDataToDelete) {
          throw new HttpException(
            { message: `No data Available for this id: ${id}` },
            HttpStatus.EXPECTATION_FAILED,
          );
        } else {
          const deleteData = await this.TeamRepository.softRemove(
            findDataToDelete,
          );

          if (!deleteData) {
            throw new HttpException(
              { message: 'Unable to delete your data please try again' },
              HttpStatus.EXPECTATION_FAILED,
            );
          } else {
            const responseData = {
              message: 'Team   deleted successfully',
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