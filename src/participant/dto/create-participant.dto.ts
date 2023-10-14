import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  dob: string;
  @IsString()
  @IsNotEmpty()
  gender: string;
  @IsString()
  @IsOptional()
  event_image_url: string;
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsOptional()
  middle_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone_number2: string;
  @IsBoolean()
  @IsOptional()
  isCheck_in: boolean;
  @IsBoolean()
  @IsOptional()
  isCheck_out: boolean;
  @IsNumber()
  @IsOptional()
  check_out: number;
  @IsNumber()
  @IsOptional()
  check_in: number;
  @IsString()
  @IsNotEmpty()
  nin: string;
  @IsString()
  @IsNotEmpty()
  bvn: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsNotEmpty()
  place: string;
  @IsString()
  @IsNotEmpty()
  phone_number: string;
  @IsNotEmpty()
  programme: any;
  @IsOptional()
  manager: any;
  @IsOptional()
  organizer_user: any;
}
