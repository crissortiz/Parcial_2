import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/users.entity/users.entity';
import { AppointmentsEntity } from 'src/appointments/entity/appointments.entity/appointments.entity';

@Entity('roles')
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  role_name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @OneToMany(() => AppointmentsEntity, (appointment) => appointment.user)
  appointments: AppointmentsEntity[];
}
