import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employe } from '../entities/employe.entity';
import { JwtPayload, UserFromJwt } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Employe)
    private employeRepository: Repository<Employe>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<UserFromJwt> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye: payload.sub },
      relations: ['categorie', 'categoriesGerees'],
    });

    if (!employe) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (!employe.estActif) {
      throw new UnauthorizedException('Votre compte a été désactivé');
    }

    return {
      mailEmploye: employe.mailEmploye,
      prenomEmploye: employe.prenomEmploye,
      nomEmploye: employe.nomEmploye,
      estAdmin: employe.estAdmin,
      idCategorie: employe.idCategorie,
      categoriesGerees:
        employe.categoriesGerees?.map((c) => c.idCategorie) || [],
    };
  }
}
