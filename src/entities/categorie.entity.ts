import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Employe } from './employe.entity';
import { Liste } from './liste.entity';

@Entity('Categorie')
export class Categorie {
  @PrimaryGeneratedColumn({ name: 'IDCategorie' })
  idCategorie: number;

  @Column({ name: 'libelleCategorie', type: 'varchar', length: 100 })
  libelleCategorie: string;

  @OneToMany(() => Employe, (employe) => employe.categorie)
  employes: Employe[];

  @OneToMany(() => Liste, (liste) => liste.categorie)
  listes: Liste[];

  @ManyToMany(() => Employe, (employe) => employe.categoriesGerees)
  employesGestionnaires: Employe[];
}
