import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';

export class CreateEmployeDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  @MaxLength(50)
  mailEmploye: string;

  @IsString()
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  @MaxLength(75)
  mdpEmploye: string;

  @IsString()
  @IsNotEmpty({ message: 'Prénom requis' })
  @MaxLength(50)
  prenomEmploye: string;

  @IsString()
  @IsNotEmpty({ message: 'Nom requis' })
  @MaxLength(60)
  nomEmploye: string;

  @IsBoolean()
  @IsOptional()
  estAdmin?: boolean;

  @IsInt()
  @IsNotEmpty({ message: 'Catégorie requise' })
  idCategorie: number;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  categoriesGerees?: number[];
}

export class UpdateEmployeDto {
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(75)
  mdpEmploye?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  prenomEmploye?: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  nomEmploye?: string;

  @IsBoolean()
  @IsOptional()
  estAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  estActif?: boolean;

  @IsInt()
  @IsOptional()
  idCategorie?: number;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  categoriesGerees?: number[];
}

export class EmployeResponseDto {
  mailEmploye: string;
  prenomEmploye: string;
  nomEmploye: string;
  estAdmin: boolean;
  estActif: boolean;
  idCategorie: number;
  categorie?: {
    idCategorie: number;
    libelleCategorie: string;
  };
}
