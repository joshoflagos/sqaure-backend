import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, Res, HttpException, HttpCode } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUpload } from 'src/helpers/fileupload';
import { HttpStatusCode } from 'axios';


@AuthGuard(AuthType.None)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  @UseInterceptors(FileInterceptor('attendance_selfie', {
    dest: 'documents/images/', fileFilter: function fileFilter(req, file, cb) {

      // The function should call `cb` with a boolean
      // to indicate if the file should be accepted
      if (file.mimetype.startsWith('image/')) {

        // To accept the file pass `true`, like so:
        cb(null, true)
      } else {
        // To reject this file pass `false`, like so:
        cb(null, false)
      }
    }
  }))
  clockin(@UploadedFile() file: FileUpload, @Body() createAttendanceDto: CreateAttendanceDto) {
    const pin = createAttendanceDto.attendance_pin; // Assuming 'pin' is a property in CreateAttendanceDto
    const filePath = file ? file.path : null;

    // Now you can save the file path along with other attendance details
    return this.attendanceService.clockin({ ...createAttendanceDto, attendance_selfie: filePath });
  }

  @Put()
  clockout(@Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.clockout(updateAttendanceDto);
  }


  // Inside your NestJS controller or service
  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res): Promise<void> {
    try {
      const file = `documents/images/${filename}`;

      res.download(file, filename);
    } catch (e) {
      throw new HttpException('cannot get file', HttpStatusCode.BadGateway)
    }

  }

  @Get(':attendancePin')
  findByPin(@Param('attendancePin') attendancePin: number) {
    return this.attendanceService.findByPin(attendancePin);
  }

}