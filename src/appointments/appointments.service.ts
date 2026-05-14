import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentsEntity } from './entity/appointments.entity/appointments.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dtos/appointments_create.dto.ts/CreateAppointmentDto';
import { UpdateAppointmentDto } from './dtos/appointments_create.dto.ts/UpdateAppointmentDto';

@Injectable()
export class AppointmentsService {

    constructor(
        @InjectRepository(AppointmentsEntity)
        private readonly appointmentsRepository: Repository<AppointmentsEntity>,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentsEntity> {
        const appointment = this.appointmentsRepository.create(createAppointmentDto);
        return this.appointmentsRepository.save(appointment);
    }

    async findAll(): Promise<AppointmentsEntity[]> {
        return this.appointmentsRepository.find();
    }

    async findOne(id: string): Promise<AppointmentsEntity> {
        const appointment = await this.appointmentsRepository.findOne({ where: { id } });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
        return appointment;
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentsEntity> {
        await this.appointmentsRepository.update(id, updateAppointmentDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.appointmentsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
    }
}
