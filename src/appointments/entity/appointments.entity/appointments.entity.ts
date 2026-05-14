import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/users/users.entity/users.entity';

export enum AppointmentStatus {
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    DONE = 'done'
}

@Entity('appointments')
export class AppointmentsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    id_user: string;

    @Column({ type: 'timestamp' })
    datetime: Date;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING
    })
    status: AppointmentStatus;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @ManyToOne(() => UserEntity)
    user: UserEntity;
}
