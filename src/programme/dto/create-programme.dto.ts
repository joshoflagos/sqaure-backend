import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateProgrammeDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  start_date: string;
  @IsString()
  @IsNotEmpty()
  end_date: string;
  @IsString()
  @IsOptional()
  participant_allowance: string;
  @IsString()
  @IsOptional()
  manager_allowance: string;
  @IsString()
  @IsOptional()
  participant_rate: string;
  @IsString()
  @IsOptional()
  participant_distance: string;
  @IsString()
  @IsOptional()
  manager_rate: string;
  @IsString()
  @IsOptional()
  manager_distance: string;
  @IsString()
  @IsNotEmpty()
  venue: string;
  @IsString()
  @IsOptional()
  event_image_url: string;
  @IsString()
  @IsOptional()
  attachement_programme: string;
  @IsNotEmpty()
  manager: any;
  @IsNotEmpty()
  organizer: any;
  @IsNotEmpty()
  organizer_user: any;
}
