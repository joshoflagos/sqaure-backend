import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly TeamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.TeamService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.TeamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.TeamService.findOne(id);
  }
  @Get('/organizer-users/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.TeamService.findAllByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.TeamService.update(id, updateTeamDto);
  }

  @AuthGuard(AuthType.None)
  @Get('/auth/:auth_link')
  login(@Param('auth_link') auth_link: string) {
    return this.TeamService.login(auth_link);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.TeamService.remove(id);
  }
}
