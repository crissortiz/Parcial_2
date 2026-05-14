import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Decorador que nos permite enviar los roles requeridos en la metadata de la ruta
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
