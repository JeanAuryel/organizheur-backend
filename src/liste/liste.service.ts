import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Liste } from '../entities/liste.entity';
import { Employe } from '../entities/employe.entity';
import { Categorie } from '../entities/categorie.entity';
import { Tache } from '../entities/tache.entity';
import {
  CreateListeDto,
  UpdateListeDto,
  ListeResponseDto,
} from '../dto/liste.dto';

@Injectable()
export class ListeService {
  constructor(
    @InjectRepository(Liste)
    private readonly listeRepository: Repository<Liste>,
    @InjectRepository(Employe)
    private readonly employeRepository: Repository<Employe>,
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
    @InjectRepository(Tache)
    private readonly tacheRepository: Repository<Tache>,
  ) {}

  async create(
    createListeDto: CreateListeDto,
    mailEmploye: string,
  ): Promise<ListeResponseDto> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    // Vérifier la catégorie si la liste n'est pas personnelle
    if (!createListeDto.estPersonnelle) {
      if (!createListeDto.idCategorie) {
        throw new BadRequestException(
          'Une liste non-personnelle doit être associée à une catégorie',
        );
      }

      const categorie = await this.categorieRepository.findOne({
        where: { idCategorie: createListeDto.idCategorie },
      });

      if (!categorie) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      // Vérifier que l'employé appartient à cette catégorie (sauf si admin)
      if (
        !employe.estAdmin &&
        employe.idCategorie !== createListeDto.idCategorie
      ) {
        throw new ForbiddenException(
          'Vous ne pouvez créer une liste collaborative que pour votre catégorie',
        );
      }
    }

    const liste = this.listeRepository.create({
      ...createListeDto,
      mailEmployeCreateur: mailEmploye,
      idCategorie: createListeDto.estPersonnelle
        ? null
        : createListeDto.idCategorie,
    });

    const saved = await this.listeRepository.save(liste);
    const listeWithRelations = await this.listeRepository.findOne({
      where: { idListe: saved.idListe },
      relations: ['createur', 'categorie'],
    });

    if (!listeWithRelations) {
      throw new NotFoundException('Liste créée mais non retrouvée');
    }

    return this.toResponseDto(listeWithRelations);
  }

  async findAll(
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<ListeResponseDto[]> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    let listes: Liste[];

    if (estAdmin) {
      // Les admins voient toutes les listes non archivées
      listes = await this.listeRepository.find({
        where: { estArchivee: false },
        relations: ['createur', 'categorie', 'taches'],
        order: { dateCreationListe: 'DESC' },
      });
    } else {
      // Les employés voient :
      // 1. Leurs listes personnelles
      // 2. Les listes collaboratives de leur catégorie
      listes = await this.listeRepository
        .createQueryBuilder('liste')
        .leftJoinAndSelect('liste.createur', 'createur')
        .leftJoinAndSelect('liste.categorie', 'categorie')
        .leftJoinAndSelect('liste.taches', 'taches')
        .where('liste.estArchivee = :estArchivee', { estArchivee: false })
        .andWhere(
          '(liste.estPersonnelle = :estPersonnelle AND liste.mailEmploye = :mailEmploye) OR (liste.estPersonnelle = :estCollaborative AND liste.IDCategorie = :idCategorie)',
          {
            estPersonnelle: true,
            estCollaborative: false,
            mailEmploye: mailEmploye,
            idCategorie: employe.idCategorie,
          },
        )
        .orderBy('liste.dateCreationListe', 'DESC')
        .getMany();
    }

    return listes.map((liste) => this.toResponseDto(liste));
  }

  async findOne(
    idListe: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<ListeResponseDto> {
    const liste = await this.listeRepository.findOne({
      where: { idListe },
      relations: ['createur', 'categorie', 'taches', 'taches.createur'],
    });

    if (!liste) {
      throw new NotFoundException(`Liste #${idListe} non trouvée`);
    }

    // Vérifier les droits d'accès
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      const hasAccess = liste.estPersonnelle
        ? liste.mailEmployeCreateur === mailEmploye
        : liste.idCategorie === employe.idCategorie;

      if (!hasAccess) {
        throw new ForbiddenException("Vous n'avez pas accès à cette liste");
      }
    }

    return this.toResponseDto(liste);
  }

  async update(
    idListe: number,
    updateListeDto: UpdateListeDto,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<ListeResponseDto> {
    const liste = await this.listeRepository.findOne({
      where: { idListe },
      relations: ['categorie'],
    });

    if (!liste) {
      throw new NotFoundException(`Liste #${idListe} non trouvée`);
    }

    // Vérifier les droits de modification
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      const hasAccess = liste.estPersonnelle
        ? liste.mailEmployeCreateur === mailEmploye
        : liste.idCategorie === employe.idCategorie;

      if (!hasAccess) {
        throw new ForbiddenException(
          "Vous n'avez pas le droit de modifier cette liste",
        );
      }
    }

    // Si on archive la liste, on archive aussi ses tâches
    if (updateListeDto.estArchivee && !liste.estArchivee) {
      liste.dateArchivageListe = new Date();
    }

    Object.assign(liste, updateListeDto);
    const updated = await this.listeRepository.save(liste);

    const listeWithRelations = await this.listeRepository.findOne({
      where: { idListe: updated.idListe },
      relations: ['createur', 'categorie'],
    });

    if (!listeWithRelations) {
      throw new NotFoundException('Liste mise à jour mais non retrouvée');
    }

    return this.toResponseDto(listeWithRelations);
  }

  async remove(
    idListe: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<void> {
    const liste = await this.listeRepository.findOne({
      where: { idListe },
      relations: ['taches'],
    });

    if (!liste) {
      throw new NotFoundException(`Liste #${idListe} non trouvée`);
    }

    // Vérifier les droits de suppression
    if (!estAdmin) {
      if (liste.mailEmployeCreateur !== mailEmploye) {
        throw new ForbiddenException(
          'Seul le créateur ou un admin peut supprimer cette liste',
        );
      }
    }

    // Supprimer d'abord les tâches associées
    if (liste.taches && liste.taches.length > 0) {
      await this.tacheRepository.remove(liste.taches);
    }

    await this.listeRepository.remove(liste);
  }

  async getListesByCategorie(
    idCategorie: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<ListeResponseDto[]> {
    // Vérifier que l'utilisateur a accès à cette catégorie
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      if (employe.idCategorie !== idCategorie) {
        throw new ForbiddenException(
          'Vous ne pouvez voir que les listes de votre catégorie',
        );
      }
    }

    const listes = await this.listeRepository.find({
      where: {
        idCategorie,
        estPersonnelle: false,
        estArchivee: false,
      },
      relations: ['createur', 'categorie', 'taches'],
      order: { dateCreationListe: 'DESC' },
    });

    return listes.map((liste) => this.toResponseDto(liste));
  }

  async getListesPersonnelles(
    mailEmploye: string,
  ): Promise<ListeResponseDto[]> {
    const listes = await this.listeRepository.find({
      where: {
        mailEmployeCreateur: mailEmploye,
        estPersonnelle: true,
        estArchivee: false,
      },
      relations: ['createur', 'taches'],
      order: { dateCreationListe: 'DESC' },
    });

    return listes.map((liste) => this.toResponseDto(liste));
  }

  private toResponseDto(liste: Liste): ListeResponseDto {
    const nombreTaches = liste.taches?.length || 0;
    const nombreTachesCompletes =
      liste.taches?.filter((t) => t.etatTache).length || 0;

    return {
      idListe: liste.idListe,
      libelleListe: liste.libelleListe,
      dateCreationListe: liste.dateCreationListe,
      dateMAJList: liste.dateMAJList,
      dateArchivageListe: liste.dateArchivageListe,
      estPersonnelle: liste.estPersonnelle,
      estArchivee: liste.estArchivee,
      mailEmployeCreateur: liste.mailEmployeCreateur,
      idCategorie: liste.idCategorie,
      createur: liste.createur
        ? {
            mailEmploye: liste.createur.mailEmploye,
            prenomEmploye: liste.createur.prenomEmploye,
            nomEmploye: liste.createur.nomEmploye,
          }
        : undefined,
      categorie: liste.categorie
        ? {
            idCategorie: liste.categorie.idCategorie,
            libelleCategorie: liste.categorie.libelleCategorie,
          }
        : undefined,
      nombreTaches,
      nombreTachesCompletes,
    };
  }
}
