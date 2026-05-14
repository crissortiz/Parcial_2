import { IsDate, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { AppointmentStatus } from "../../entity/appointments.entity/appointments.entity";

export class UpdateAppointmentDto {

    @IsEnum(AppointmentStatus)
    @IsOptional()
    status: AppointmentStatus;
}