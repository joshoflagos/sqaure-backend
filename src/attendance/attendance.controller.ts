import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';

@AuthGuard(AuthType.None)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  clockin(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.clockin(createAttendanceDto);
  }

  @Put()
  clockout(@Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.clockout(updateAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

}
