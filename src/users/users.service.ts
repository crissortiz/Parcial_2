import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserEntity } from './users.entity/users.entity';
import { RolesEntity } from '../roles/roles.entity/roles.entity';
import { AssignRolesDto } from './dtos/assign-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  async assignRoles(userId: string, assignRolesDto: AssignRolesDto) {
    // Buscar el usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar en la BD que los roles indicados sí existan
    const rolesToAssign = await this.rolesRepository.find({
      where: { role_name: In(assignRolesDto.roles) },
    });

    // Si la cantidad de roles devueltos no es la misma, significa que enviaron un rol que no existe en DB
    if (rolesToAssign.length !== assignRolesDto.roles.length) {
      throw new BadRequestException('roles inválidos');
    }

    // Asignamos los objetos Role completos a la relación
    user.roles = rolesToAssign;
    await this.userRepository.save(user);

    return { message: 'Roles asignados' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: user.roles.map((r) => r.role_name),
    };
  }

  async findAllUsers() {
    try {
      const users = await this.userRepository.find({
        relations: ['roles'],
      });

      return users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((r) => r.role_name),
      }));
    } catch {
      throw new InternalServerErrorException('Error al listar usuarios');
    }
  }
}
