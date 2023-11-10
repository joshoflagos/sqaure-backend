import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgrammeDto {


  @IsOptional()
  presence_type: string;
  @IsOptional()
  name: string;
  @IsOptional()
  work_order_id: string;
  @IsOptional()
  start_date: string;
  @IsOptional()
  end_date: string;
  @IsOptional()
  participant_allowance: string;
  @IsOptional()
  participant_airtime: string;
  @IsOptional()
  participant_rate: string;
  @IsOptional()
  participant_distance: string;

  @IsOptional()
  venue: string;
  @IsOptional()
  event_attachement_programme: string;
  @IsOptional()
  agenda_attachement_programme: string;
  @IsOptional()
  budget_attachement_programme: string;
  @IsOptional()
  other_attachement_programme: string;



  @IsNotEmpty()
  team: any;
  @IsNotEmpty()
  organizer: any;
  @IsNotEmpty()
  organizer_user: any;
}
