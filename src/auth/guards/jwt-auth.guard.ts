import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard extiende el guard de Passport JWT.
// Verificará si el token existe, es válido y no ha expirado.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
