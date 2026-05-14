import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AssignRolesDto } from './dtos/assign-roles.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: { user?: { id: string } }) {
    const user = req.user as { id: string };
    return this.usersService.getProfile(user.id);
  }

  // PATCH /users/:id/roles
  @Patch(':id/roles')
  @Roles('admin') // Solo administradores
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    return this.usersService.assignRoles(id, assignRolesDto);
  }

  // GET /users
  @Get()
  @Roles('admin') // Solo administradores
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }
}
