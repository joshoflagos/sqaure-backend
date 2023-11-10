import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateTeamUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;

  @IsString()
  @IsOptional()
  ref: string;

  @IsString()
  @IsOptional()
  reset_token: string;

  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsString()
  last_updated_at: string;
}
