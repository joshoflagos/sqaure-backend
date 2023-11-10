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
  check_in: number;

  @IsOptional()
  check_out: number;

  @IsOptional()
  bank_name: string;
  @IsOptional()
  organization: string;

  @IsOptional()
  programme: any;
}
