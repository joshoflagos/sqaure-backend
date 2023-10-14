import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  phone_1: string;
  @IsString()
  @IsOptional()
  phone_2: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsOptional()
  banner_image_url: string;
  @IsNotEmpty()
  organizer_user: any;
}
