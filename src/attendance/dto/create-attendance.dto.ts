import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAttendanceDto {

    @IsNotEmpty()
    attendance_pin: any;

    @IsOptional()
    attendance_selfie: string;
}
