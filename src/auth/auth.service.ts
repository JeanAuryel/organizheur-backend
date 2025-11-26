import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employe } from '../entities/employe.entity';
import { LoginDto, AuthResponseDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employe)
    private readonly employeRepository: Repository<Employe>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    mailEmploye: string,
    mdpEmploye: string,
  ): Promise<Employe | null> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
      relations: ['categorie'],
    });

    if (!employe) {
      return null;
    }

    if (!employe.estActif) {
      throw new ForbiddenException('Votre compte a été désactivé');
    }

    const isPasswordValid = await bcrypt.compare(
      mdpEmploye,
      employe.mdpEmploye,
    );

    if (!isPasswordValid) {
      return null;
    }

    return employe;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const employe = await this.validateUser(
      loginDto.mailEmploye,
      loginDto.mdpEmploye,
    );

    if (!employe) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = {
      email: employe.mailEmploye,
      sub: employe.mailEmploye,
      isAdmin: employe.estAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        mailEmploye: employe.mailEmploye,
        prenomEmploye: employe.prenomEmploye,
        nomEmploye: employe.nomEmploye,
        estAdmin: employe.estAdmin,
        estActif: employe.estActif,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
