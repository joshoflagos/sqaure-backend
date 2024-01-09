import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateParticipantDto {
  @IsOptional()
  reg_selfie: string;

  @IsOptional()
  title: string;
  @IsOptional()
  surname: string;
  @IsOptional()
  firstname: string;
  @IsOptional()
  lastname: string;
  @IsOptional()
  gender: string;
  @IsOptional()
  email: string;
  @IsOptional()
  phone_1: string;
  @IsOptional()
  phone_2: string;

  @IsOptional()
  bank_account_name: string;

  @IsOptional()
  bank_account_number: string;

@IsOptional()
  attendance_pin: number;

  @IsOptional()
  attendance_selfie: string;

  @IsOptional()
  bank_name: string;
  @IsOptional()
  bank_code: string;
  @IsOptional()
  organization: string;

  @IsOptional()
  programme?: any;
}
