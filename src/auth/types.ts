import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface UserFromJwt {
  mailEmploye: string;
  prenomEmploye: string;
  nomEmploye: string;
  estAdmin: boolean;
  idCategorie: number;
  categoriesGerees: number[];
}

export interface RequestWithUser extends Request {
  user: UserFromJwt;
}
