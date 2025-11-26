import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categorie } from './categorie.entity';
import { Employe } from './employe.entity';
import { Tache } from './tache.entity';

@Entity('Liste')
export class Liste {
  @PrimaryGeneratedColumn({ name: 'IDListe' })
  idListe: number;

  @Column({ name: 'libelleTache', type: 'varchar', length: 255 })
  libelleListe: string;

  @CreateDateColumn({ name: 'dateCreationListe', type: 'datetime' })
  dateCreationListe: Date;

  @UpdateDateColumn({ name: 'dateMAJList', type: 'datetime' })
  dateMAJList: Date;

  @Column({
    name: 'dateArchivageListe',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  dateArchivageListe: Date | null;

  @Column({ name: 'estPersonnelle', type: 'boolean', default: false })
  estPersonnelle: boolean;

  @Column({ name: 'estArchivee', type: 'boolean', default: false })
  estArchivee: boolean;

  @Column({ name: 'mailEmploye', type: 'varchar', length: 50 })
  mailEmployeCreateur: string;

  @Column({ name: 'IDCategorie', nullable: true })
  idCategorie: number | null;

  @ManyToOne(() => Employe, (employe) => employe.listesCreees)
  @JoinColumn({ name: 'mailEmploye' })
  createur: Employe;

  @ManyToOne(() => Employe, (employe) => employe.listesModifiees, {
    nullable: true,
  })
  @JoinColumn({ name: 'mailEmploye' })
  dernierModificateur: Employe;

  @ManyToOne(() => Categorie, (categorie) => categorie.listes, {
    nullable: true,
  })
  @JoinColumn({ name: 'IDCategorie' })
  categorie: Categorie | null;

  @OneToMany(() => Tache, (tache) => tache.liste)
  taches: Tache[];

  @ManyToMany(() => Employe, (employe) => employe.listesRevisees)
  reviseurs: Employe[];
}
