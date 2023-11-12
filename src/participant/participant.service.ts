import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { ProgrammeService } from '../programme/programme.service';
import { CheckincheckoutTokenService } from 'src/checkincheckout-token/checkincheckout-token.service';
import * as csvParser from 'csv-parser';
import stream = require('stream');
import { MailerService } from 'src/shared/mailer/mailer.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly programmeService: ProgrammeService,
    private readonly mailerService: MailerService,
    private readonly checkinoutTokenService: CheckincheckoutTokenService,
  ) { }
  async create(createParticipantDto: CreateParticipantDto) {
    try {

      const getProgramme = await this.programmeService.findById(
        createParticipantDto.programme,
      );

      const checkExisting = await this.participantRepository.findOne({ where: { email: createParticipantDto.email, programme: { id: createParticipantDto.programme } } })
      if (checkExisting) {
        throw new HttpException('Participant already exist!!!', HttpStatus.BAD_REQUEST);
      }
      // createParticipantDto.organizer_user = getUser;
      createParticipantDto.programme = getProgramme;
      createParticipantDto.attendance_pin =
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
        const html = `
        <!DOCTYPE html>
        <html>
<head>
<title>Registration Invitation for ${getProgramme.name}</title>
</head>
<body>
<h2>Registration Invitation for ${getProgramme.name}</h2>
<p>Dear ${savetoDb.firstname},</p>

<p>We hope this message finds you well. We are thrilled to invite you to the upcoming ${getProgramme.name} that promises to be an exciting and enriching experience.</p>

<h3>Event Details:</h3>
<ul>
    <li>Date: ${getProgramme.start_date}</li>
    <li>Location: ${getProgramme.venue}</li>
</ul> 

<p>To secure your spot at ${getProgramme.name}, please follow these simple registration steps:</p>
<ol>
<li>Visit our event registration page at <a href="https://ideaint.com.ng/p/register/${savetoDb.id}">Register</a>.</li>
<li>Fill out the registration form with your details, including your name, contact information, and any other requested information.</li>
<li>Click on the "Register Now" button.</li>
</ol>

<p>Please note that registration is on a first-come, first-served basis, so we encourage you to register as soon as possible to secure your place at the event. If you have any questions or encounter any issues during the registration process, please feel free to contact our dedicated support team at <a href="mailto:[Support Email/Phone]">[Support Email/Phone]</a>.</p>

<p>We look forward to welcoming you to ${getProgramme.name} and sharing a memorable experience with you. Don't miss out on this opportunity to <em>[mention any exclusive perks or special features of the event]</em>.</p>

<p>Thank you for considering our invitation, and we anticipate your participation in making this event a success. We can't wait to see you there!</p>

<p>Best regards,<br>
IDEA INT ${getProgramme.team[0].team_address}<br>


</body>
</html>     
        `;

        const options = {
          email: savetoDb.email,
          subject: 'Invitation',
          html: html,
        };

        await this.mailerService.sendMail(options);

        const responseData = {
          message: 'Participant created successfully',
          data: savetoDb,
        };
        return responseData;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all participant`;
  }


  async findAllByProgrammeId(programmeId: string) {
    try {
      const getall = await this.participantRepository.find({
        where: { programme: { id: programmeId } },
        relations: { programme: true },
        order: { surname: 'ASC' },
      });
   
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }


  async findOne(id: string) {
    try {

      const getOne = await this.participantRepository.findOne({
        where: { id },
        relations: { programme: true },
      });

      if (!getOne) {
        throw new HttpException(
          `No data availabe for this id ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return getOne;

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
        if (!getExistingData) {
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
              message: 'Participate   deleted successfully',
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


  async importDataFromCSV(buffer: Buffer, programmeId: string) {
    const programme = await this.programmeService.findById(programmeId);
    const records = [];
    // Convert the buffer to a readable stream

    try {
      // Convert the buffer to a readable stream
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      // Parse the CSV data
      bufferStream
        .pipe(csvParser())
        .on('data', (data) => records.push(data))
        .on('end', async () => {
          for (const record of records) {

            const checkExisting = await this.participantRepository.findOne({ where: { email: record?.email, programme: { id: programmeId } } })
            if (checkExisting) {
              null
            } else {
              const attendance_pin =
                this.checkinoutTokenService.generateRandom4DigitNumber();
              const check_out =
                this.checkinoutTokenService.generateRandom4DigitNumber();
              const participant = this.participantRepository.create({ email: record?.email, programme: programme, attendance_pin: attendance_pin })
              const savedParticipant = await this.participantRepository.save(participant);

              const html = `
            <!DOCTYPE html>
            <html>
<head>
    <title>Registration Invitation for ${programme.name}</title>
</head>
<body>
    <h2>Registration Invitation for ${programme.name}</h2>
    <p>Hello there,</p>

    <p>We hope this message finds you well. We are thrilled to invite you to the upcoming ${programme.name} that promises to be an exciting and enriching experience. This event is a fantastic opportunity for you to <em>[briefly describe the event's key benefits or highlights]</em>.</p>

    <h3>Event Details:</h3>
    <ul>
    <li>Date: ${programme.start_date}</li> 
    <li>Location: ${programme.venue}</li>
    </ul>

    <p>To secure your spot at ${programme.name}, please follow these simple registration steps:</p>
    <ol>
        <li>Visit our event registration page at <a href="https://ideaint.com.ng/p/register/${participant.id}">Register</a>.</li>
        <li>Fill out the registration form with your details, including your name, contact information, and any other requested information.</li>
        <li>Click on the "Register Now" button.</li>
    </ol>

    <p>Please note that registration is on a first-come, first-served basis, so we encourage you to register as soon as possible to secure your place at the event. If you have any questions or encounter any issues during the registration process, please feel free to contact our dedicated support team at <a href="mailto:[Support Email/Phone]">[Support Email/Phone]</a>.</p>

    <p>We look forward to welcoming you to ${programme.name} and sharing a memorable experience with you. Don't miss out on this opportunity to <em>[mention any exclusive perks or special features of the event]</em>.</p>

    <p>Thank you for considering our invitation, and we anticipate your participation in making this event a success. We can't wait to see you there!</p>

    <p>Best regards,<br>
    <p>Best regards,<br>
    ${programme.team[0].project_coordinator_first_name} ${programme.team[0].project_coordinator_last_name}<br>
    Project Co-ordindator<br>
    
</body>
</html>     
            `;

              const options = {
                email: savedParticipant.email,
                subject: 'Invitation',
                html: html,
              };

              await this.mailerService.sendMail(options);
            }


            return {
              message: 'Data imported successfully',
              status: HttpStatus.OK,
            };
          }
        });
    } catch (err) {
      console.log(err)
      throw new HttpException(
        'Failed import',
        HttpStatus.UNPROCESSABLE_ENTITY,
        { cause: new Error(err) },
      );
    }
  }
}
