import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './roles.entity/roles.entity';
import { CreateRoleDto } from './dtos/create-role.dto';

interface PgError extends Error {
  code?: string;
}

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const role = this.rolesRepository.create(createRoleDto);
      const savedRole = await this.rolesRepository.save(role);
      return {
        message: 'Rol creado con éxito',
        roleId: savedRole.id,
      };
    } catch (rawError) {
      const error = rawError as PgError;
      if (error.code === '23505') {
        throw new ConflictException('role_name ya existe');
      }
      throw new InternalServerErrorException('Error al crear el rol');
    }
  }

  async findAllRoles() {
    try {
      return await this.rolesRepository.find({
        select: ['id', 'role_name', 'description'], // El PDF pide devolver { id, role_name, description }
      });
    } catch {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }
}
