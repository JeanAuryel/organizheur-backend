import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Categorie } from './categorie.entity';
import { Liste } from './liste.entity';
import { Tache } from './tache.entity';
import { Exclude } from 'class-transformer';

@Entity('Employe')
export class Employe {
  @PrimaryColumn({ name: 'mailEmploye', type: 'varchar', length: 50 })
  mailEmploye: string;

  @Column({ name: 'MDPEmploye', type: 'varchar', length: 75 })
  @Exclude() // Exclure le mot de passe des réponses API
  mdpEmploye: string;

  @Column({ name: 'prenomEmploye', type: 'varchar', length: 50 })
  prenomEmploye: string;

  @Column({ name: 'nomEmploye', type: 'varchar', length: 60 })
  nomEmploye: string;

  @Column({ name: 'estAdmin', type: 'boolean', default: false })
  estAdmin: boolean;

  @Column({ name: 'estActif', type: 'boolean', default: true })
  estActif: boolean;

  @Column({ name: 'IDCategorie' })
  idCategorie: number;

  @ManyToOne(() => Categorie, (categorie) => categorie.employes)
  @JoinColumn({ name: 'IDCategorie' })
  categorie: Categorie;

  @OneToMany(() => Liste, (liste) => liste.createur)
  listesCreees: Liste[];

  @OneToMany(() => Liste, (liste) => liste.dernierModificateur)
  listesModifiees: Liste[];

  @OneToMany(() => Tache, (tache) => tache.createur)
  tachesCreees: Tache[];

  @OneToMany(() => Tache, (tache) => tache.dernierModificateur)
  tachesModifiees: Tache[];

  @ManyToMany(() => Categorie)
  @JoinTable({
    name: 'gerer',
    joinColumn: { name: 'mailEmploye', referencedColumnName: 'mailEmploye' },
    inverseJoinColumn: {
      name: 'IDCategorie',
      referencedColumnName: 'idCategorie',
    },
  })
  categoriesGerees: Categorie[];

  @ManyToMany(() => Liste)
  @JoinTable({
    name: 'reviser',
    joinColumn: { name: 'mailEmploye', referencedColumnName: 'mailEmploye' },
    inverseJoinColumn: { name: 'IDListe', referencedColumnName: 'idListe' },
  })
  listesRevisees: Liste[];

  @ManyToMany(() => Tache)
  @JoinTable({
    name: 'Changer',
    joinColumn: { name: 'mailEmploye', referencedColumnName: 'mailEmploye' },
    inverseJoinColumn: { name: 'IDTache', referencedColumnName: 'idTache' },
  })
  tachesChangees: Tache[];

  @ManyToMany(() => Tache)
  @JoinTable({
    name: 'completer',
    joinColumn: { name: 'mailEmploye', referencedColumnName: 'mailEmploye' },
    inverseJoinColumn: { name: 'IDTache', referencedColumnName: 'idTache' },
  })
  tachesCompletees: Tache[];
}
