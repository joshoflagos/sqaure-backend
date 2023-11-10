import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
 

 
  @IsOptional()
  phone_2: string;

  @IsOptional()
  programme_manager_first_name: string;
  @IsOptional()
  programme_manager_last_name: String;
  @IsOptional()
  programme_manager_email: string;
  @IsOptional()
  programme_manager_gender: string;
  @IsOptional()
  programme_manager_phone_1: string;
  @IsOptional()
  programme_manager_phone_2: string;


  @IsOptional()
  project_coordinator_first_name: string;
  @IsOptional()
  project_coordinator_last_name: String;
  @IsOptional()
  project_coordinator_email: string;
  @IsOptional()
  project_coordinator_gender: string;
  @IsOptional()
  project_coordinator_phone_1: string;
  @IsOptional()
  project_coordinator_phone_2: string;

  @IsOptional()
  administrative_assistant_first_name: string;
  @IsOptional()
  administrative_assistant_last_name: String;
  @IsOptional()
  administrative_assistant_email: string;
  @IsOptional()
  administrative_assistant_gender: string;
  @IsOptional()
  administrative_assistant_phone_1: string;
  @IsOptional()
  administrative_assistant_phone_2: string;

  @IsOptional()
  team_address: string;

 
  @IsOptional()
  auth_link: string;

  @IsNotEmpty()
  organizer_user: any;
}
