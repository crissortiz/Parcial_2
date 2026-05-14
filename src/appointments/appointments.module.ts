import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsEntity } from './entity/appointments.entity/appointments.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentsEntity]), UsersModule],
  providers: [AppointmentsService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule { }

