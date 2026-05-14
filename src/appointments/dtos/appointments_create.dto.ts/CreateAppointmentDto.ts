import { IsDate, IsNotEmpty, IsString, IsEnum } from "class-validator";
import { AppointmentStatus } from "../../entity/appointments.entity/appointments.entity";

export class CreateAppointmentDto {

    @IsString()
    @IsNotEmpty()
    id_user: string;

    @IsDate()
    @IsNotEmpty()
    datetime: Date;

    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}
