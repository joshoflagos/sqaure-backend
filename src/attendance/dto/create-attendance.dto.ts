import { IsNotEmpty } from "class-validator";

export class CreateAttendanceDto {

    @IsNotEmpty()
    attendance_pin: any;

    @IsNotEmpty()
    attendance_selfie: string;
}
