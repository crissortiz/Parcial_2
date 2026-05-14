import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard) // 1. Exige que el usuario esté logueado (JWT) y luego verifica sus roles
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('admin') // 2. Exige explícitamente el rol "admin"
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @Roles('admin') // Solo un admin puede listar los roles
  async findAllRoles() {
    return this.rolesService.findAllRoles();
  }
}
