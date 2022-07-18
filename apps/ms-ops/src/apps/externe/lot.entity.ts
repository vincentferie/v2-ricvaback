import { StateLots } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
  OneToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ReportWarnEntity } from './report.entity';
import { UnloadingEntity } from './unloading.entity';
import { AnalysesEntity } from './analyse.entity';
import { FileTicketEntity } from './file-ticket-pesee.entity';
import { DetailsExecutionEntity } from './detail-execution.entity';
import { LotPottingPlanEntity } from '../potting-plan/potting-plan-lots/potting-plan-lots.entity';
import { TenantCampagneEntity } from './campagne.entity';

@Entity('lot', { schema: 'cashew' })
@Index(
  'index_campagne_entrepot_numerolot',
  ['campagne_id', 'entrepot_id', 'numero_lot'],
  { unique: true },
)
export class LotEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  superviseur_id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'uuid' })
  site_id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_id: UUIDVersion;

  @Column({ type: 'uuid' })
  exportateur_id: UUIDVersion;

  @Column({ type: 'uuid' })
  speculation_id: UUIDVersion;

  @Column({ type: 'uuid', unique: true })
  dechargement_id: UUIDVersion;

  @Column({ type: 'uuid' })
  specificity_id: UUIDVersion;

  @Column({ type: 'bigint' })
  numero_ticket_pese: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  code_dechargement: string;

  @Column({ type: 'bigint' })
  numero_lot: number;

  @Column({ type: 'int' })
  sac_en_stock: number;

  @Column({ type: 'int' })
  premiere_pesee: number;

  @Column({ type: 'int' })
  deuxieme_pesee: number;

  @Column({ type: 'int' })
  reconditionne: number;

  @Column({ type: 'int' })
  tare_emballage_refraction: number;

  @Column({ type: 'int' })
  sacs_decharge: number;

  @Column({ type: 'int' })
  poids_net: number;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_dechargement: Date;

  @Column({ type: 'enum', enum: StateLots, nullable: true })
  statut: StateLots;

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
    () => UnloadingEntity,
    (dechargement: UnloadingEntity) => dechargement.lots,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'dechargement_id', referencedColumnName: 'id' })
  dechargement: UnloadingEntity;

  @OneToOne(() => FileTicketEntity, (file: FileTicketEntity) => file.lot, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  file: FileTicketEntity;

  @ManyToOne(
    () => AccountEntity,
    (superviseur: AccountEntity) => superviseur.lots,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;

  @OneToOne(() => AnalysesEntity, (analyses: AnalysesEntity) => analyses.lots, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  analyses: AnalysesEntity;

  @OneToMany(
    () => ReportWarnEntity,
    (signaler: ReportWarnEntity) => signaler.lot,
    {
      nullable: true,
      onUpdate: 'RESTRICT',
    },
  )
  signaler: ReportWarnEntity[];

  @OneToMany(
    () => DetailsExecutionEntity,
    (detailExecutionEmpotage: DetailsExecutionEntity) => detailExecutionEmpotage.lot,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  detailExecutionEmpotage: DetailsExecutionEntity;

  @OneToMany(
    () => LotPottingPlanEntity,
    (lotPlanEmpotage: LotPottingPlanEntity) => lotPlanEmpotage.lot,
    {
      nullable: true,
      onUpdate: 'RESTRICT',
    },
  )
  lotPlanEmpotage: LotPottingPlanEntity[];
  
}
