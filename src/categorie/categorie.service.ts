import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../entities/categorie.entity';
import {
  CreateCategorieDto,
  UpdateCategorieDto,
  CategorieResponseDto,
} from '../dto/categorie.dto';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
  ) {}

  async create(
    createCategorieDto: CreateCategorieDto,
  ): Promise<CategorieResponseDto> {
    const categorie = this.categorieRepository.create(createCategorieDto);
    const saved = await this.categorieRepository.save(categorie);
    return this.mapToResponseDto(saved);
  }

  async findAll(): Promise<CategorieResponseDto[]> {
    const categories = await this.categorieRepository.find({
      order: { libelleCategorie: 'ASC' },
    });
    return categories.map((c) => this.mapToResponseDto(c));
  }

  async findOne(id: number): Promise<CategorieResponseDto> {
    const categorie = await this.categorieRepository.findOne({
      where: { idCategorie: id },
    });

    if (!categorie) {
      throw new NotFoundException(`Catégorie #${id} non trouvée`);
    }

    return this.mapToResponseDto(categorie);
  }

  async update(
    id: number,
    updateCategorieDto: UpdateCategorieDto,
  ): Promise<CategorieResponseDto> {
    const categorie = await this.categorieRepository.findOne({
      where: { idCategorie: id },
    });

    if (!categorie) {
      throw new NotFoundException(`Catégorie #${id} non trouvée`);
    }

    Object.assign(categorie, updateCategorieDto);
    const updated = await this.categorieRepository.save(categorie);
    return this.mapToResponseDto(updated);
  }

  async remove(id: number): Promise<void> {
    const categorie = await this.categorieRepository.findOne({
      where: { idCategorie: id },
      relations: ['employes', 'listes'],
    });

    if (!categorie) {
      throw new NotFoundException(`Catégorie #${id} non trouvée`);
    }

    if (categorie.employes?.length > 0 || categorie.listes?.length > 0) {
      throw new ConflictException(
        'Impossible de supprimer une catégorie utilisée par des employés ou des listes',
      );
    }

    await this.categorieRepository.remove(categorie);
  }

  private mapToResponseDto(categorie: Categorie): CategorieResponseDto {
    return {
      idCategorie: categorie.idCategorie,
      libelleCategorie: categorie.libelleCategorie,
    };
  }
}
