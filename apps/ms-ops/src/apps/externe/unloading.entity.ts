import { StateChargement } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ExporterEntity } from './exporter.entity';
import { ReportWarnEntity } from './report.entity';
import { SpecificityEntity } from './specificity.entity';
import { WarehousesEntity } from './warehouses.entity';
import { LotEntity } from './lot.entity';
import { FileUnloadingEntity } from './file-unloading.entity';
import { TenantCampagneEntity } from './campagne.entity';

@Entity('dechargement', { schema: 'cashew' })
export class UnloadingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  superviseur_id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'uuid' })
  provenance_id: UUIDVersion;

  @Column({ type: 'uuid' })
  specificity_id: UUIDVersion;

  @Column({ type: 'uuid' })
  exportateur_id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_id: UUIDVersion;

  @Column({ type: 'uuid' })
  speculation_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  num_fiche: string;

  @Column({ type: 'timestamp without time zone' })
  date_dechargement: Date;

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

  @ManyToOne(
    () => TenantCampagneEntity,
    (campagne: TenantCampagneEntity) => campagne.dechargements,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: TenantCampagneEntity;

  @ManyToOne(
    () => AccountEntity,
    (superviseur: AccountEntity) => superviseur.dechargements,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;

  @ManyToOne(
    () => SpecificityEntity,
    (specificite: SpecificityEntity) => specificite.dechargements,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'specificity_id', referencedColumnName: 'id' })
  specificite: SpecificityEntity;

  @ManyToOne(
    () => WarehousesEntity,
    (entrepot: WarehousesEntity) => entrepot.dechargements,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: WarehousesEntity;

  @ManyToOne(
    () => ExporterEntity,
    (exportateur: ExporterEntity) => exportateur.dechargements,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
  exportateur: ExporterEntity;

  @OneToOne(
    () => FileUnloadingEntity,
    (file: FileUnloadingEntity) => file.dechargement,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  file: FileUnloadingEntity;

  @OneToMany(() => LotEntity, (lots: LotEntity) => lots.dechargement, {
    nullable: false,
    onUpdate: 'RESTRICT',
  })
  lots: LotEntity[];

  @OneToMany(
    () => ReportWarnEntity,
    (signaler: ReportWarnEntity) => signaler.dechargement,
    {
      nullable: true,
      onUpdate: 'RESTRICT',
      eager: true,
    },
  )
  signaler: ReportWarnEntity[];
}
