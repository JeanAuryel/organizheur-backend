import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Employe } from '../entities/employe.entity';
import { Categorie } from '../entities/categorie.entity';
import {
  CreateEmployeDto,
  UpdateEmployeDto,
  EmployeResponseDto,
} from '../dto/employe.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeService {
  constructor(
    @InjectRepository(Employe)
    private readonly employeRepository: Repository<Employe>,
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
  ) {}

  async create(
    createEmployeDto: CreateEmployeDto,
  ): Promise<EmployeResponseDto> {
    const existingEmploye = await this.employeRepository.findOne({
      where: { mailEmploye: createEmployeDto.mailEmploye },
    });

    if (existingEmploye) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const categorie = await this.categorieRepository.findOne({
      where: { idCategorie: createEmployeDto.idCategorie },
    });

    if (!categorie) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    const hashedPassword = await bcrypt.hash(createEmployeDto.mdpEmploye, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoriesGerees, ...employeData } = createEmployeDto;
    const employe = this.employeRepository.create({
      ...employeData,
      mdpEmploye: hashedPassword,
      estAdmin: createEmployeDto.estAdmin || false,
      estActif: true,
    });

    let savedEmploye = await this.employeRepository.save(employe);

    if (
      createEmployeDto.categoriesGerees &&
      createEmployeDto.categoriesGerees.length > 0
    ) {
      const categories = await this.categorieRepository.find({
        where: { idCategorie: In(createEmployeDto.categoriesGerees) },
      });
      savedEmploye.categoriesGerees = categories;
      savedEmploye = await this.employeRepository.save(savedEmploye);
    }

    const employeWithRelations = await this.employeRepository.findOne({
      where: { mailEmploye: savedEmploye.mailEmploye },
      relations: ['categorie'],
    });

    if (!employeWithRelations) {
      throw new NotFoundException('Employé créé mais non retrouvé');
    }

    return this.toResponseDto(employeWithRelations);
  }

  async findAll(): Promise<EmployeResponseDto[]> {
    const employes = await this.employeRepository.find({
      relations: ['categorie'],
      order: { nomEmploye: 'ASC' },
    });

    return employes.map((employe) => this.toResponseDto(employe));
  }

  async findOne(mailEmploye: string): Promise<EmployeResponseDto> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
      relations: ['categorie', 'categoriesGerees'],
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    return this.toResponseDto(employe);
  }

  async findByEmail(mailEmploye: string): Promise<Employe | null> {
    return this.employeRepository.findOne({
      where: { mailEmploye },
      relations: ['categorie'],
    });
  }

  async update(
    mailEmploye: string,
    updateEmployeDto: UpdateEmployeDto,
  ): Promise<EmployeResponseDto> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    if (updateEmployeDto.idCategorie) {
      const categorie = await this.categorieRepository.findOne({
        where: { idCategorie: updateEmployeDto.idCategorie },
      });

      if (!categorie) {
        throw new NotFoundException('Catégorie non trouvée');
      }
    }

    if (updateEmployeDto.mdpEmploye) {
      updateEmployeDto.mdpEmploye = await bcrypt.hash(
        updateEmployeDto.mdpEmploye,
        10,
      );
    }

    Object.assign(employe, updateEmployeDto);
    let updatedEmploye = await this.employeRepository.save(employe);

    if (updateEmployeDto.categoriesGerees !== undefined) {
      if (updateEmployeDto.categoriesGerees.length > 0) {
        const categories = await this.categorieRepository.find({
          where: { idCategorie: In(updateEmployeDto.categoriesGerees) },
        });
        updatedEmploye.categoriesGerees = categories;
      } else {
        updatedEmploye.categoriesGerees = [];
      }
      updatedEmploye = await this.employeRepository.save(updatedEmploye);
    }

    const employeWithRelations = await this.employeRepository.findOne({
      where: { mailEmploye },
      relations: ['categorie'],
    });

    if (!employeWithRelations) {
      throw new NotFoundException('Employé mis à jour mais non retrouvé');
    }

    return this.toResponseDto(employeWithRelations);
  }

  async remove(mailEmploye: string): Promise<void> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    await this.employeRepository.update({ mailEmploye }, { estActif: false });
  }

  async findByCategorie(idCategorie: number): Promise<EmployeResponseDto[]> {
    const employes = await this.employeRepository.find({
      where: { idCategorie, estActif: true },
      relations: ['categorie'],
    });

    return employes.map((employe) => this.toResponseDto(employe));
  }

  private toResponseDto(employe: Employe): EmployeResponseDto {
    return {
      mailEmploye: employe.mailEmploye,
      prenomEmploye: employe.prenomEmploye,
      nomEmploye: employe.nomEmploye,
      estAdmin: employe.estAdmin,
      estActif: employe.estActif,
      idCategorie: employe.idCategorie,
      categorie: employe.categorie
        ? {
            idCategorie: employe.categorie.idCategorie,
            libelleCategorie: employe.categorie.libelleCategorie,
          }
        : undefined,
    };
  }
}
