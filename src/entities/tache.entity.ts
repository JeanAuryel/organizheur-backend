import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employe } from './employe.entity';
import { Liste } from './liste.entity';

@Entity('Tache')
export class Tache {
  @PrimaryGeneratedColumn({ name: 'IDTache' })
  idTache: number;

  @Column({ name: 'libelleTache', type: 'varchar', length: 255 })
  libelleTache: string;

  @Column({ name: 'dateEcheanceTache', type: 'datetime', nullable: true })
  dateEcheanceTache: Date | null;

  @Column({ name: 'etatTache', type: 'boolean', default: false })
  etatTache: boolean;

  @CreateDateColumn({ name: 'dateCreationTache', type: 'datetime' })
  dateCreationTache: Date;

  @UpdateDateColumn({ name: 'dateMAJTache', type: 'datetime' })
  dateMAJTache: Date;

  @Column({
    name: 'dateCompletionTache',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  dateCompletionTache: Date | null;

  @Column({ name: 'mailEmploye', type: 'varchar', length: 50 })
  mailEmployeCreateur: string;

  @Column({ name: 'mailEmploye_1', type: 'varchar', length: 50 })
  mailEmployeModificateur: string;

  @Column({ name: 'IDListe' })
  idListe: number;

  @ManyToOne(() => Employe, (employe) => employe.tachesCreees)
  @JoinColumn({ name: 'mailEmploye' })
  createur: Employe;

  @ManyToOne(() => Employe, (employe) => employe.tachesModifiees)
  @JoinColumn({ name: 'mailEmploye_1' })
  dernierModificateur: Employe;

  @ManyToOne(() => Liste, (liste) => liste.taches)
  @JoinColumn({ name: 'IDListe' })
  liste: Liste;

  @ManyToMany(() => Employe, (employe) => employe.tachesChangees)
  modificateurs: Employe[];

  @ManyToMany(() => Employe, (employe) => employe.tachesCompletees)
  completeurs: Employe[];
}
