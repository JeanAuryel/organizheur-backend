import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  mailEmploye: string;

  @IsString()
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  mdpEmploye: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    mailEmploye: string;
    prenomEmploye: string;
    nomEmploye: string;
    estAdmin: boolean;
    estActif: boolean;
  };
}
