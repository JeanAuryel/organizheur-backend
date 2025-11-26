import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsInt,
  ValidateIf,
} from 'class-validator';

export class CreateListeDto {
  @IsString()
  @IsNotEmpty({ message: 'Le libellé de la liste est requis' })
  @MaxLength(255)
  libelleListe: string;

  @IsBoolean()
  @IsOptional()
  estPersonnelle?: boolean;

  @ValidateIf((o: CreateListeDto) => !o.estPersonnelle)
  @IsInt()
  @IsNotEmpty({
    message: 'Une liste non-personnelle doit être associée à une catégorie',
  })
  idCategorie?: number;
}

export class UpdateListeDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  libelleListe?: string;

  @IsBoolean()
  @IsOptional()
  estArchivee?: boolean;
}

export class ListeResponseDto {
  idListe: number;
  libelleListe: string;
  dateCreationListe: Date;
  dateMAJList: Date;
  dateArchivageListe: Date | null;
  estPersonnelle: boolean;
  estArchivee: boolean;
  mailEmployeCreateur: string;
  idCategorie: number | null;
  createur?: {
    mailEmploye: string;
    prenomEmploye: string;
    nomEmploye: string;
  };
  categorie?: {
    idCategorie: number;
    libelleCategorie: string;
  };
  nombreTaches?: number;
  nombreTachesCompletes?: number;
}
