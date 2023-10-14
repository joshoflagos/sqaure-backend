import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateManagerDto {
  @IsString()
  @IsNotEmpty()
  manager_first_name: string;
  @IsString()
  @IsNotEmpty()
  manager_last_name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  gender: string;
  @IsString()
  @IsNotEmpty()
  nin: string;
  @IsString()
  @IsNotEmpty()
  bvn: string;
  @IsString()
  @IsNotEmpty()
  phone_1: string;
  @IsString()
  @IsOptional()
  phone_2: string;
  @IsString()
  @IsNotEmpty()
  bank_account_number: string;
  @IsString()
  @IsNotEmpty()
  bank_name: string;
  @IsString()
  @IsNotEmpty()
  bank_account_name: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsOptional()
  auth_link: string;
  @IsString()
  @IsOptional()
  passport_url: string;
  @IsNotEmpty()
  organizer_user: any;
}
