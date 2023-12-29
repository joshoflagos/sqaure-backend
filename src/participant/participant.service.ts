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

<p>You are hereby invited to the event themed, ${getProgramme.name} organized by international IDEA.</p>


<ul>
    <li>Date of activity:    ${getProgramme.start_date.toLocaleDateString()} - ${getProgramme.end_date.toLocaleDateString()}</li>
    <li>Start time:          ${getProgramme.start_date.toLocaleTimeString()}</li>
    <li>End time:            ${getProgramme.end_date.toLocaleTimeString()}</li>
    <li>Attendance Pin: ${savetoDb.attendance_pin}</li>
</ul> 


<p>Kindly click on this <a href="https://app.ideaint.com.ng/p/register/${savetoDb.id}">LINK.</a> to fill your details <b>for the purpose of registration</b> and attendance for maximum planning, processing of travel stipend, reimbursement, etc. </p>

<p>Thank you for your anticipated cooperation</p>

<p>Regards,<br>
<div>For: <b>International IDEA Nigeria</b></div>
<div>Implementing the Rule of Law & Corruption <b>(RoLAC II)</b></div>
<div>Funded by the European Union <b>(EU)</b></div>
<br>


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
        relations: { programme: true,attendance:true },
        order: { surname: 'ASC' },
      }); 
      return getall
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }


  async findOne(id: string) {
    try {

      const getOne = await this.participantRepository.findOne({
        where: { id },
        relations: { programme: true,attendance:true },
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

  async findOneByPin(attendance_pin: number) {
    try {

      const getOne = await this.participantRepository.findOne({
        where: { attendance_pin },
        relations: { programme: { team: true } },
      });

      if (!getOne) {
        throw new HttpException(
          `No reservation found with the pin ${attendance_pin}`,
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
          relations: { programme: { team: true } }
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
            const html = `
            <!DOCTYPE html>
            <html>
<head>
    <title>Registration Successfull for ${getExistingData.programme.name}</title>
</head>
<body>
    <h2>Registration Successfull for ${getExistingData.programme.name}</h2>
    <p>Hello there,</p>
    <p>This is to confirm that your information submitted successfuly.</p>


    <h3>Event Details:</h3>
    <ul>
    <li>Date: ${getExistingData.programme.start_date}</li> 
    <li>Location: ${getExistingData.programme.venue}</li>
    <li>Attendance Pin: ${getExistingData.attendance_pin}</li>
    </ul>

    <p>To secure your spot at ${getExistingData.programme.name}, keep your attendance pin secured as it will be required for attendance.</p>


    

    <p>We look forward to welcoming you to ${getExistingData.programme.name} and sharing a memorable experience with you. Don't miss out on this opportunity to <em>[mention any exclusive perks or special features of the event]</em>.</p>

    <p>Thank you for considering our invitation, and we anticipate your participation in making this event a success. We can't wait to see you there!</p>

    <p>Best regards,<br>

    <p>Regards,<br>
    <div>For: <b>International IDEA Nigeria</b></div>
    <div>Implementing the Rule of Law & Corruption <b>(RoLAC II)</b></div>
    <div>Funded by the European Union <b>(EU)</b></div>
    <br>
    
</body>
</html>     
            `;

            const options = {
              email: getExistingData.email,
              subject: 'Registration Confirmed',
              html: html,
            };

            await this.mailerService.sendMail(options);
          }


          const responseData = {
            message: 'Participant data updated successfully',
            data: updateData,
          };
          return responseData;
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
            } 
            else {
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
<p>Hello,</p>

<p>You are hereby invited to the event themed, ${programme.name} organized by international IDEA.</p>


<ul>
    <li>Date of activity:    ${programme.start_date.toLocaleDateString()} - ${programme.end_date.toLocaleDateString()}</li>
    <li>Start time:          ${programme.start_date.toLocaleTimeString()}</li>
    <li>End time:            ${programme.end_date.toLocaleTimeString()}</li>

</ul> 


<p>Kindly click on this <a href="https://app.ideaint.com.ng/p/register/${savedParticipant.id}">LINK.</a> to fill your details <b>for the purpose of registration</b> and attendance for maximum planning, processing of travel stipend, reimbursement, etc. </p>

<p>Thank you for your anticipated cooperation</p>

<p>Regards,<br>
<div>For: <b>International IDEA Nigeria</b></div>
<div>Implementing the Rule of Law & Corruption <b>(RoLAC II)</b></div>
<div>Funded by the European Union <b>(EU)</b></div>
<br>


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


           
          }
          return {
            message: 'Data imported successfully',
            status: HttpStatus.OK,
          };
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
