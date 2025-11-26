import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateTacheDto {
  @IsString()
  @IsNotEmpty({ message: 'Le libellé de la tâche est requis' })
  @MaxLength(255)
  libelleTache: string;

  @IsDateString()
  @IsOptional()
  dateEcheanceTache?: string;

  @IsInt()
  @IsNotEmpty({ message: 'La tâche doit être associée à une liste' })
  idListe: number;
}

export class UpdateTacheDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  libelleTache?: string;

  @IsDateString()
  @IsOptional()
  dateEcheanceTache?: string;

  @IsBoolean()
  @IsOptional()
  etatTache?: boolean;
}

export class TacheResponseDto {
  idTache: number;
  libelleTache: string;
  dateEcheanceTache: Date | null;
  etatTache: boolean;
  dateCreationTache: Date;
  dateMAJTache: Date;
  dateCompletionTache: Date | null;
  mailEmployeCreateur: string;
  mailEmployeModificateur: string;
  idListe: number;
  createur?: {
    mailEmploye: string;
    prenomEmploye: string;
    nomEmploye: string;
  };
  dernierModificateur?: {
    mailEmploye: string;
    prenomEmploye: string;
    nomEmploye: string;
  };
  liste?: {
    idListe: number;
    libelleListe: string;
  };
}
