import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  @Get()
  findAll() {
    return this.participantService.findAll();
  }
  @AuthGuard(AuthType.None)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantService.findOne(id);
  } @Get('/programme/:id')
  findAllByProgrammeId(@Param('id') id: string) {
    return this.participantService.findAllByProgrammeId(id);
  } 
  @AuthGuard(AuthType.None)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipantDto: UpdateParticipantDto) {
    return this.participantService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantService.remove(id);
  }

   
  @AuthGuard(AuthType.Bearer)
  @Post('/import-csv/:programmeId')
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(
    @UploadedFile() file: Express.Multer.File,
    @Param('programmeId') programmeId: string,
  ) {
    if (file) {
      if (file.mimetype == 'text/csv') {
        await this.participantService.importDataFromCSV(file.buffer, programmeId);
      } else {
        throw new HttpException(
          'Unsupported file format',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      // Handle file not found or other errors
      throw new HttpException('No file', HttpStatus.NOT_FOUND);
    }
  }

  @AuthGuard(AuthType.None)
  @Get('/dashboard/:id')
  public async dashboardMetric(@Param('id') id:string): Promise<any> {
    return this.participantService.dashboardMetric(id);
  }
}
