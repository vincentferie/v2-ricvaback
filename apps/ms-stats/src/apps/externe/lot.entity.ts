import { StateLots } from '@app/saas-component/helpers/enums';
import { ReportWarnEntity } from 'apps/ms-sup/src/apps/externe/report.entity';
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
import { LotPottingPlanEntity } from './potting-plan-lots.entity';
import { AnalysesEntity } from './analyse.entity';
import { DetailsExecutionEntity } from './detail-execution.entity';
import { UnloadingEntity } from './unloading.entity';

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

  @Column({ type: 'varchar', length: 300, unique: true })
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
    () => UnloadingEntity,
    (dechargement: UnloadingEntity) => dechargement.lots,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'dechargement_id', referencedColumnName: 'id' })
  dechargement: UnloadingEntity;

  @OneToOne(() => AnalysesEntity, (analyses: AnalysesEntity) => analyses.lots, {
    nullable: false,

    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  analyses: AnalysesEntity;

  @OneToMany(
    () => LotPottingPlanEntity,
    (lotPlanEmpotage: LotPottingPlanEntity) => lotPlanEmpotage.lot,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  lotPlanEmpotage: LotPottingPlanEntity[];

  @OneToMany(
    () => DetailsExecutionEntity,
    (detailExecutionEmpotage: DetailsExecutionEntity) =>
      detailExecutionEmpotage.lot,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  detailExecutionEmpotage: DetailsExecutionEntity[];

}
