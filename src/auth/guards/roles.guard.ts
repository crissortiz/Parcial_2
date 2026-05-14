import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos definidos en el decorador de la ruta
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no exige roles, la dejamos pasar
    if (!requiredRoles) {
      return true;
    }

    // 2. Extraer al usuario inyectado previamente por el JwtAuthGuard
    const request = context
      .switchToHttp()
      .getRequest<{ user: { roles: string[] } }>();
    const user = request.user;

    // Si no hay usuario o no tiene roles asiganados, es denegado
    if (!user || !user.roles) {
      throw new ForbiddenException('No autorizado');
    }

    // 3. Verificar si en la lista de roles del usuario está el rol exigido por la ruta
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasRequiredRole) {
      // El PDF exige retornar 403 con mensaje "No autorizado"
      throw new ForbiddenException('No autorizado');
    }

    return true;
  }
}
