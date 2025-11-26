import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty({ message: 'Le libellé de la catégorie est requis' })
  @MaxLength(100, {
    message: 'Le libellé ne peut pas dépasser 100 caractères',
  })
  libelleCategorie: string;
}

export class UpdateCategorieDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'Le libellé ne peut pas dépasser 100 caractères',
  })
  libelleCategorie?: string;
}

export class CategorieResponseDto {
  idCategorie: number;
  libelleCategorie: string;
}
