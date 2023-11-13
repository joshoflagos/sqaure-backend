import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { CreateComponentsDto } from './dto/create-components.dto';
import { UpdateComponentsDto } from './dto/update-components.dto';
import { AuthGuard } from 'src/iam/login/decorators/auth-guard.decorator';
import { AuthType } from 'src/iam/login/enums/auth-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
  @AuthGuard(AuthType.Bearer)
@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  create(@Body() createComponentsDto: CreateComponentsDto) {
    return this.componentsService.create(createComponentsDto);
  }

  @Get()
  findAll() {
    return this.componentsService.findAll();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComponentsDto: UpdateComponentsDto) {
    return this.componentsService.update(id, updateComponentsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentsService.remove(id);
  }



  @Post('/import-csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      if (file.mimetype == 'text/csv') {
        await this.componentsService.importDataFromCSV(file.buffer);
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
}
