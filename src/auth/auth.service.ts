import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity/users.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface PgError extends Error {
  code?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { password, ...rest } = registerDto;

      // Hashear contraseña usando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        ...rest,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);

      return {
        message: 'Usuario registrado con éxito',
        userId: savedUser.id,
      };
    } catch (rawError) {
      const error = rawError as PgError;
      // Error 23505 en PostgreSQL significa 'unique_violation' (ya existe el email)
      if (error.code === '23505') {
        throw new ConflictException('Email ya registrado');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['roles'], // Necesitamos los roles para incluirlos en el token
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Si el usuario no está activo, devolvemos error 423 (Locked)
    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', HttpStatus.LOCKED);
    }

    // Mapeamos los nombres de los roles que tiene el usuario
    const roles = user.roles ? user.roles.map((role) => role.role_name) : [];

    // Payload del JWT
    const payload = {
      sub: user.id,
      email: user.email,
      roles: roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
