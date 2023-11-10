import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateComponentsDto } from './dto/create-components.dto';
import { UpdateComponentsDto } from './dto/update-components.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Components } from './entities/components.entity';
import { Repository } from 'typeorm';
import * as csvParser from 'csv-parser';
import stream = require('stream');

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Components)
    private readonly componentsRepository: Repository<Components>,
  ) { }
  async create(createComponentsDto: CreateComponentsDto) {
    try {



      const checkExisting = await this.componentsRepository.findOne({ where: { work_order_id: createComponentsDto.work_order_id} })
      if (checkExisting) {
        throw new HttpException('Components already exist!!!', HttpStatus.BAD_REQUEST);
      }

      const create =
        this.componentsRepository.create(createComponentsDto);
      const savetoDb = await this.componentsRepository.save(create);

      if (!savetoDb) {
        throw new HttpException(
          'Unable to save Components data',
          HttpStatus.BAD_REQUEST,
        );
      } else {

        const responseData = {
          message: 'Components created successfully',
          data: savetoDb,
        };
        return responseData;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {

      const getOne = await this.componentsRepository.find();

    
      return getOne;

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }




  async findOne(id: string) {
    try {

      const getOne = await this.componentsRepository.findOne({
        where: { id },

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

  async update(id: string, updateComponentsDto: UpdateComponentsDto) {
    try {
      if (!id || id == null || id == undefined) {
        throw new HttpException(
          'No data avialable for this id',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        const getExistingData = await this.componentsRepository.findOne({
          where: { id },
        });
        if (!getExistingData) {
          throw new HttpException(
            `No record available for this ${id} `,
            HttpStatus.NOT_FOUND,
          );
        } else {
          const updateData = await this.componentsRepository.update(
            { id: getExistingData?.id },
            { ...updateComponentsDto },
          );

          if (!updateData) {
            throw new HttpException(
              { message: 'Unable to update your data' },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const responseData = {
              message: 'Components data updated successfully',
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
        const findDataToDelete = await this.componentsRepository.findOne({
          where: { id },
        });
        if (!findDataToDelete) {
          throw new HttpException(
            { message: `No data Available for this id: ${id}` },
            HttpStatus.EXPECTATION_FAILED,
          );
        } else {
          const deleteData = await this.componentsRepository.softRemove(
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


  async importDataFromCSV(buffer: Buffer) {
   
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
            const checkExisting = await this.componentsRepository.findOne({ where: { work_order_id: record?.work_order_id, } })
            if (checkExisting) {
              null
            } else {
              const components = this.componentsRepository.create({ work_order_id: record?.work_order_id,work_order_name:record?.work_order_name,component_and_sub:record?.work_order_name,component_lead:record?.component_lead })
              await this.componentsRepository.save(components);


              return {
                message: 'Data imported successfully',
                status: HttpStatus.OK,
              };
            }
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
