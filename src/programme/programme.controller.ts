import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgrammeService } from './programme.service';
import { CreateProgrammeDto } from './dto/create-programme.dto';
import { UpdateProgrammeDto } from './dto/update-programme.dto';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('programme')
@Controller('programme')
export class ProgrammeController {
  constructor(private readonly programmeService: ProgrammeService) {}

  @Post()
  create(@Body() createProgrammeDto: CreateProgrammeDto) {
    return this.programmeService.create(createProgrammeDto);
  }

  @Get()
  findAll() {
    return this.programmeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programmeService.findOne(id);
  }
  @Get('/organizer-users/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.programmeService.findAllByUserId(id);
  }
  @AuthGuard(AuthType.None)
  @Get('/team/:id')
  findAllByTeamId(@Param('id') id: string) {
    return this.programmeService.findAllByTeamId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgrammeDto: UpdateProgrammeDto,
  ) {
    return this.programmeService.update(id, updateProgrammeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programmeService.remove(id);
  }
}
