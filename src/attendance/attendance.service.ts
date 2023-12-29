import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { ParticipantService } from 'src/participant/participant.service';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { MailerService } from 'src/shared/mailer/mailer.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly participantService: ParticipantService,
    private readonly mailerService: MailerService
  ) { }
  async clockin(createAttendanceDto: CreateAttendanceDto) {
    try {

      const participant = await this.participantService.findOneByPin(createAttendanceDto.attendance_pin)
      const attendance = await this.attendanceRepository.findOne({where:{participant:{id:participant.id},date:new Date().toLocaleDateString()}})
      console.log(attendance)
      if (!attendance) {
        const clockinDateTime = new Date(); // Replace this with your actual clockinDateTime
        const startDateTime = participant.programme.start_date;
        const timeDifferenceInMilliseconds = clockinDateTime.getTime() - startDateTime.getTime();

        const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds

        // Check if the clockinDateTime is within 30 minutes after the start_date
        if (timeDifferenceInMilliseconds > (0 - thirtyMinutesInMilliseconds * 2) && timeDifferenceInMilliseconds <= thirtyMinutesInMilliseconds) {
          // Do something
          const newAttendance = this.attendanceRepository.create({ attendance_selfie: createAttendanceDto.attendance_selfie, participant: participant, status: 'in', is_punctual: true,date:new Date().toLocaleDateString() })
          const html = `
        <!DOCTYPE html>
        <html>
  <head>
  <title>Clock in confirmed</title>
  </head>
  <body>
  <h2>Clock in confirmed</h2>
  <p>${newAttendance.participant.surname} ${newAttendance.participant.firstname} ${newAttendance.participant.lastname} (${newAttendance.participant.gender.toUpperCase()})</p>
  
  <p>Program: ${newAttendance.participant.programme.name}.</p>
  
  <p>Clocked in at: ${clockinDateTime}.</p>
  
  <p>Status: Punctual.</p>
  <br/>
  <p>Please note that late comers will get a 50% slash in allowance<br>

  <p>Regards,<br>
    <div>For: <b>International IDEA Nigeria</b></div>
    <div>Implementing the Rule of Law & Corruption <b>(RoLAC II)</b></div>
    <div>Funded by the European Union <b>(EU)</b></div>
    <br>
  </body>
  </html>     
        `;

          const options = {
            email: newAttendance.participant.email,
            subject: 'Clockin confirmed',
            html: html,
          };

          await this.mailerService.sendMail(options);
          return await this.attendanceRepository.save(newAttendance)
          // console.log('Clock in occurred within 30 minutes after the program start date.');
        } else if (timeDifferenceInMilliseconds > thirtyMinutesInMilliseconds) {
          // Do something else
          const newAttendance = this.attendanceRepository.create({ attendance_selfie: createAttendanceDto.attendance_selfie, participant: participant, status: 'in', is_punctual: false,date:new Date().toLocaleDateString() })
          const html = `
        <!DOCTYPE html>
        <html>
  <head>
  <title>Clock in confirmed</title>
  </head>
  <body>
  <h2>Clock in confirmed</h2>
  <p>${newAttendance.participant.surname} ${newAttendance.participant.firstname} ${newAttendance.participant.lastname} (${newAttendance.participant.gender.toUpperCase()})</p>
  
  <p>Program: ${newAttendance.participant.programme.name}.</p>
  
  <p>Clocked in at: ${clockinDateTime}.</p>
  
  <p>Status: Punctual.</p>
  <br/>
  <p>Please note that late comers will get a 50% slash in allowance<br>

  <p>Regards,<br>
    <div>For: <b>International IDEA Nigeria</b></div>
    <div>Implementing the Rule of Law & Corruption <b>(RoLAC II)</b></div>
    <div>Funded by the European Union <b>(EU)</b></div>
    <br>
  </body>
  </html>     
        `;

          const options = {
            email: newAttendance.participant.email,
            subject: 'Clockin confirmed',
            html: html,
          };

          await this.mailerService.sendMail(options);
          return await this.attendanceRepository.save(newAttendance)
          // console.log('Clock in did  occur after 30 minutes of the program start date.');

        }

        else {
          throw new HttpException('clockin starts 60 minute before the start of programme', HttpStatus.BAD_REQUEST, { cause: new Error('cannot clockin 30 minute before start of event') })
          //         // Do something else
          //         const newAttendance = this.attendanceRepository.create({ attendance_selfie: createAttendanceDto.attendance_selfie, participant: participant, status: 'in', is_punctual: true })
          //         const html = `
          //       <!DOCTYPE html>
          //       <html>
          // <head>
          // <title>Clock in confirmed</title>
          // </head>
          // <body>
          // <h2>Clock in confirmed</h2>
          // <p>Dear ${newAttendance.participant.firstname},</p>

          // <p>Clock in for ${newAttendance.participant.programme.name} has been confirmed.</p>

          // <p>Best regards!!!<br>



          // </body>
          // </html>     
          //       `;

          //         const options = {
          //           email: newAttendance.participant.email,
          //           subject: 'Clockin confirmed',
          //           html: html,
          //         };

          //         await this.mailerService.sendMail(options);

          //         return await this.attendanceRepository.save(newAttendance)
          //         // console.log('Clock in did not occur within 30 minutes after the program start date.');
          //       }

        }
      }
      else {
        throw new HttpException('cannot clockin twice', HttpStatus.BAD_REQUEST, { cause: new Error('cannot clockin twice') })
      }
    } catch (error) {
      console.log(error)
      throw new HttpException(error || 'cannot clockin attendance', HttpStatus.BAD_REQUEST, { cause: new Error(error) })
    }
  }

  async clockout(updateAttendanceDto: UpdateAttendanceDto) {
    try {
      const participant = await this.participantService.findOneByPin(updateAttendanceDto.attendance_pin)
      const clockoutDateTime = new Date(); // Replace this with your actual clockoutDateTime
      const endDateTime = participant.programme.end_date;
      const timeDifferenceInMilliseconds = clockoutDateTime.getTime() - endDateTime.getTime();

      const oneMinutesInMilliseconds = 1 * 60 * 1000; // 1 minutes in milliseconds


      const attendance = await this.findOne(participant.id)
      if (attendance.status == 'in' && timeDifferenceInMilliseconds >= oneMinutesInMilliseconds) {
        const html = `
        <!DOCTYPE html>
        <html>
  <head>
  <title>Clock out confirmed</title>
  </head>
  <body>
  <h2>Clock out confirmed</h2>
  <p>${attendance.participant.surname} ${attendance.participant.firstname} ${attendance.participant.lastname} (${attendance.participant.gender.toUpperCase()})</p>
  
  <p>Program: ${attendance.participant.programme.name}.</p>
  
  <p>Clocked out at: ${clockoutDateTime}.</p>
  <p>Please note that late comers will get a 50% slash in allowance<br>

  <p>Regards,<br>
    <div>For: <b>International IDEA Nigeria</b></div>
    <div>Implementing the Rule of Law & Corruption <b>(RoLAC II)</b></div>
    <div>Funded by the European Union <b>(EU)</b></div>
    <br>

  </body>
  </html>     
        `;

        const options = {
          email: attendance.participant.email,
          subject: 'Clockout confirmed',
          html: html,
        };

        await this.mailerService.sendMail(options);
        return await this.attendanceRepository.update({ id: attendance.id }, { status: 'out' })
      }
      else if (timeDifferenceInMilliseconds < oneMinutesInMilliseconds) {
        throw new HttpException('cannot clockout before end of programme', HttpStatus.BAD_REQUEST, { cause: new Error('cannot clockout before end of programme') })
      }
      if (attendance.status == 'out') {
        throw new HttpException('cannot clockout twice', HttpStatus.BAD_REQUEST, { cause: new Error('cannot clockout twice') })
      }
      else {
        throw new HttpException('cannot clockout because you never clocked in', HttpStatus.BAD_REQUEST, { cause: new Error('cannot clockout because you never clocked in') })
      }

    } catch (error) {
      console.log(error)
      throw new HttpException(error || 'cannot clockout attendance', HttpStatus.BAD_REQUEST, { cause: new Error(error) })
    }
  }

  async findAllByProgrammeId(programmeId: string) {
    const attendance = await this.attendanceRepository.find({ where: { participant: { programme: { id: programmeId } } } })
    return attendance;
  }

  async findOne(participantId: string) {
    try {
      return await this.attendanceRepository.findOne({ where: { participant: { id: participantId }, }, relations: { participant: { programme: { team: true } } } });
    } catch (error) {
      throw new HttpException('cannot get attendance', HttpStatus.BAD_REQUEST, { cause: new Error(error) })
    }
  }

  async findByPin(attendancePin: number) {
    try {
      return await this.attendanceRepository.findOne({ where: { participant: { attendance_pin: attendancePin }, } });
    } catch (error) {
      throw new HttpException('cannot get attendance', HttpStatus.BAD_REQUEST, { cause: new Error(error) })
    }
  }

}
