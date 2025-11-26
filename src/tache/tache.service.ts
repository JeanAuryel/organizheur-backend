import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tache } from '../entities/tache.entity';
import { Liste } from '../entities/liste.entity';
import { Employe } from '../entities/employe.entity';
import {
  CreateTacheDto,
  UpdateTacheDto,
  TacheResponseDto,
} from '../dto/tache.dto';

@Injectable()
export class TacheService {
  constructor(
    @InjectRepository(Tache)
    private readonly tacheRepository: Repository<Tache>,
    @InjectRepository(Liste)
    private readonly listeRepository: Repository<Liste>,
    @InjectRepository(Employe)
    private readonly employeRepository: Repository<Employe>,
  ) {}

  async create(
    createTacheDto: CreateTacheDto,
    mailEmploye: string,
  ): Promise<TacheResponseDto> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    // Vérifier que la liste existe
    const liste = await this.listeRepository.findOne({
      where: { idListe: createTacheDto.idListe },
      relations: ['categorie'],
    });

    if (!liste) {
      throw new NotFoundException('Liste non trouvée');
    }

    // Vérifier que l'utilisateur a accès à cette liste
    const hasAccess =
      employe.estAdmin ||
      (liste.estPersonnelle
        ? liste.mailEmployeCreateur === mailEmploye
        : liste.idCategorie === employe.idCategorie);

    if (!hasAccess) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit de créer une tâche dans cette liste",
      );
    }

    const tache = this.tacheRepository.create({
      ...createTacheDto,
      mailEmployeCreateur: mailEmploye,
      mailEmployeModificateur: mailEmploye,
      etatTache: false,
    });

    const saved = await this.tacheRepository.save(tache);
    const tacheWithRelations = await this.tacheRepository.findOne({
      where: { idTache: saved.idTache },
      relations: ['createur', 'dernierModificateur', 'liste'],
    });

    if (!tacheWithRelations) {
      throw new NotFoundException('Tâche créée mais non retrouvée');
    }

    return this.toResponseDto(tacheWithRelations);
  }

  async findAll(
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<TacheResponseDto[]> {
    const employe = await this.employeRepository.findOne({
      where: { mailEmploye },
    });

    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    let taches: Tache[];

    if (estAdmin) {
      // Les admins voient toutes les tâches
      taches = await this.tacheRepository.find({
        relations: ['createur', 'dernierModificateur', 'liste'],
        order: { dateCreationTache: 'DESC' },
      });
    } else {
      // Les employés voient les tâches de leurs listes accessibles
      taches = await this.tacheRepository
        .createQueryBuilder('tache')
        .leftJoinAndSelect('tache.createur', 'createur')
        .leftJoinAndSelect('tache.dernierModificateur', 'dernierModificateur')
        .leftJoinAndSelect('tache.liste', 'liste')
        .where(
          '(liste.estPersonnelle = :estPersonnelle AND liste.mailEmploye = :mailEmploye) OR (liste.estPersonnelle = :estCollaborative AND liste.IDCategorie = :idCategorie)',
          {
            estPersonnelle: true,
            estCollaborative: false,
            mailEmploye: mailEmploye,
            idCategorie: employe.idCategorie,
          },
        )
        .orderBy('tache.dateCreationTache', 'DESC')
        .getMany();
    }

    return taches.map((tache) => this.toResponseDto(tache));
  }

  async findOne(
    idTache: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<TacheResponseDto> {
    const tache = await this.tacheRepository.findOne({
      where: { idTache },
      relations: [
        'createur',
        'dernierModificateur',
        'liste',
        'liste.categorie',
      ],
    });

    if (!tache) {
      throw new NotFoundException(`Tâche #${idTache} non trouvée`);
    }

    // Vérifier les droits d'accès
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      const hasAccess = tache.liste.estPersonnelle
        ? tache.liste.mailEmployeCreateur === mailEmploye
        : tache.liste.idCategorie === employe.idCategorie;

      if (!hasAccess) {
        throw new ForbiddenException("Vous n'avez pas accès à cette tâche");
      }
    }

    return this.toResponseDto(tache);
  }

  async update(
    idTache: number,
    updateTacheDto: UpdateTacheDto,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<TacheResponseDto> {
    const tache = await this.tacheRepository.findOne({
      where: { idTache },
      relations: ['liste', 'liste.categorie'],
    });

    if (!tache) {
      throw new NotFoundException(`Tâche #${idTache} non trouvée`);
    }

    // Vérifier les droits de modification
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      const hasAccess = tache.liste.estPersonnelle
        ? tache.liste.mailEmployeCreateur === mailEmploye
        : tache.liste.idCategorie === employe.idCategorie;

      if (!hasAccess) {
        throw new ForbiddenException(
          "Vous n'avez pas le droit de modifier cette tâche",
        );
      }
    }

    // Si la tâche est marquée comme complétée, enregistrer la date
    if (updateTacheDto.etatTache && !tache.etatTache) {
      tache.dateCompletionTache = new Date();
    }

    // Si la tâche est marquée comme non complétée, supprimer la date de completion
    if (updateTacheDto.etatTache === false && tache.etatTache) {
      tache.dateCompletionTache = null;
    }

    Object.assign(tache, updateTacheDto);
    tache.mailEmployeModificateur = mailEmploye;

    const updated = await this.tacheRepository.save(tache);

    const tacheWithRelations = await this.tacheRepository.findOne({
      where: { idTache: updated.idTache },
      relations: ['createur', 'dernierModificateur', 'liste'],
    });

    if (!tacheWithRelations) {
      throw new NotFoundException('Tâche mise à jour mais non retrouvée');
    }

    return this.toResponseDto(tacheWithRelations);
  }

  async remove(
    idTache: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<void> {
    const tache = await this.tacheRepository.findOne({
      where: { idTache },
      relations: ['liste'],
    });

    if (!tache) {
      throw new NotFoundException(`Tâche #${idTache} non trouvée`);
    }

    // Vérifier les droits de suppression
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      // Pour les listes personnelles, seul le créateur peut supprimer
      // Pour les listes collaboratives, tous les membres de la catégorie peuvent supprimer
      const hasAccess = tache.liste.estPersonnelle
        ? tache.mailEmployeCreateur === mailEmploye
        : tache.liste.idCategorie === employe.idCategorie;

      if (!hasAccess) {
        throw new ForbiddenException(
          "Vous n'avez pas le droit de supprimer cette tâche",
        );
      }
    }

    await this.tacheRepository.remove(tache);
  }

  async getTachesByListe(
    idListe: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<TacheResponseDto[]> {
    // Vérifier que la liste existe et que l'utilisateur y a accès
    const liste = await this.listeRepository.findOne({
      where: { idListe },
      relations: ['categorie'],
    });

    if (!liste) {
      throw new NotFoundException('Liste non trouvée');
    }

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

    const taches = await this.tacheRepository.find({
      where: { idListe },
      relations: ['createur', 'dernierModificateur', 'liste'],
      order: { dateCreationTache: 'DESC' },
    });

    return taches.map((tache) => this.toResponseDto(tache));
  }

  async toggleTacheEtat(
    idTache: number,
    mailEmploye: string,
    estAdmin: boolean,
  ): Promise<TacheResponseDto> {
    const tache = await this.tacheRepository.findOne({
      where: { idTache },
      relations: ['liste', 'liste.categorie'],
    });

    if (!tache) {
      throw new NotFoundException(`Tâche #${idTache} non trouvée`);
    }

    // Vérifier les droits
    if (!estAdmin) {
      const employe = await this.employeRepository.findOne({
        where: { mailEmploye },
      });

      if (!employe) {
        throw new NotFoundException('Employé non trouvé');
      }

      const hasAccess = tache.liste.estPersonnelle
        ? tache.liste.mailEmployeCreateur === mailEmploye
        : tache.liste.idCategorie === employe.idCategorie;

      if (!hasAccess) {
        throw new ForbiddenException(
          "Vous n'avez pas le droit de modifier cette tâche",
        );
      }
    }

    tache.etatTache = !tache.etatTache;
    tache.dateCompletionTache = tache.etatTache ? new Date() : null;
    tache.mailEmployeModificateur = mailEmploye;

    const updated = await this.tacheRepository.save(tache);

    const tacheWithRelations = await this.tacheRepository.findOne({
      where: { idTache: updated.idTache },
      relations: ['createur', 'dernierModificateur', 'liste'],
    });

    if (!tacheWithRelations) {
      throw new NotFoundException('Tâche mise à jour mais non retrouvée');
    }

    return this.toResponseDto(tacheWithRelations);
  }

  private toResponseDto(tache: Tache): TacheResponseDto {
    return {
      idTache: tache.idTache,
      libelleTache: tache.libelleTache,
      dateEcheanceTache: tache.dateEcheanceTache,
      etatTache: tache.etatTache,
      dateCreationTache: tache.dateCreationTache,
      dateMAJTache: tache.dateMAJTache,
      dateCompletionTache: tache.dateCompletionTache,
      mailEmployeCreateur: tache.mailEmployeCreateur,
      mailEmployeModificateur: tache.mailEmployeModificateur,
      idListe: tache.idListe,
      createur: tache.createur
        ? {
            mailEmploye: tache.createur.mailEmploye,
            prenomEmploye: tache.createur.prenomEmploye,
            nomEmploye: tache.createur.nomEmploye,
          }
        : undefined,
      dernierModificateur: tache.dernierModificateur
        ? {
            mailEmploye: tache.dernierModificateur.mailEmploye,
            prenomEmploye: tache.dernierModificateur.prenomEmploye,
            nomEmploye: tache.dernierModificateur.nomEmploye,
          }
        : undefined,
      liste: tache.liste
        ? {
            idListe: tache.liste.idListe,
            libelleListe: tache.liste.libelleListe,
          }
        : undefined,
    };
  }
}
