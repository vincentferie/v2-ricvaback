import { StateChargement } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LotEntity } from './lot.entity';

@Entity('dechargement', { schema: 'cashew' })
export class UnloadingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  superviseur_id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  campagne_id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  provenance_id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  specificity_id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  exportateur_id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  entrepot_id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  speculation_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  num_fiche: string;

  @Column({ type: 'timestamp without time zone' })
  date_chargement: Date;

  @Column({ type: 'varchar', length: 50 })
  tracteur: string;

  @Column({ type: 'varchar', length: 50 })
  remorque: string;

  @Column({ type: 'varchar', length: 150 })
  fournisseur: string;

  @Column({ type: 'varchar', length: 50 })
  contact_fournisseur: string;

  @Column({ type: 'varchar', length: 150 })
  transporteur: string;

  @Column({
    type: 'enum',
    enum: StateChargement,
    default: StateChargement.valider,
  })
  statut: StateChargement;

  @Column({ type: 'boolean', default: false })
  validity: boolean;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_date: Date;

  @Column({ type: 'varchar', length: 150, default: 'System' })
  created_by: string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_date: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  updated_by: string;

  @DeleteDateColumn({ type: 'timestamp without time zone' })
  deleted_date: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  deleted_by: string;

  @OneToMany(() => LotEntity, (lots: LotEntity) => lots.dechargement, {
    nullable: false,

    onUpdate: 'RESTRICT',
  })
  lots: LotEntity[];
}
