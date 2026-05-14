import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/appointments_create.dto.ts/CreateAppointmentDto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsController {

    constructor(private readonly appointmentsService: AppointmentsService) { }
    //Crear una cita
    @Post()
    @Roles('patient', 'doctor')
    async create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    @Roles('admin')
    async findAll() {
        return this.appointmentsService.findAll();
    }

    @Get(':id')
    @Roles('patient', 'doctor')
    async findOne(@Param('id') id: string) {
        return this.appointmentsService.findOne(id);
    }

    //Actualizar el estado de una cita
    @Patch(':id/status')
    @Roles('doctor')
    async updateStatus(@Param('id') id: string, @Body() status: string) {
        return this.appointmentsService.update(id, status);
    }

    //Eliminar una cita
    @Delete(':id')
    @Roles('patient')
    async remove(@Param('id') id: string) {
        return this.appointmentsService.remove(id);
    }
}

