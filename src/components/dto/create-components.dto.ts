import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateComponentsDto {
  @IsOptional()
  work_order_id: string;
  @IsOptional()
  work_order_name: string;
  @IsOptional()
  component_and_sub: string;
  @IsOptional()
  component_lead: string;
}
 