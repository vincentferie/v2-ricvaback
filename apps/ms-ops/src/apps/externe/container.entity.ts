import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Double,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { ContainerType } from '@app/saas-component/helpers/enums';
import { WarehousesEntity } from '../externe/warehouses.entity';
import { DetailBlEntity } from '../bill_of_lading/details-bl/detail-bl.entity';
import { PottingExecutionEntity } from './potting-execution.entity';
import { ContainerPottingPlanEntity } from '../potting-plan/potting-plan-container/potting-plan-container.entity';
import { PlombEntity } from './plomb.entity';

@Entity('conteneur', { schema: 'cashew' })
export class ContainerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  booking_id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_id: UUIDVersion;

  @Column({ type: 'varchar', length: 25 })
  numero: string;

  @Column({
    type: 'enum',
    enum: ContainerType,
    default: ContainerType.quarantePied,
  })
  type_tc: ContainerType;

  @Column({ type: 'int', nullable: true })
  capacite: number;

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
    () => WarehousesEntity,
    (entrepot: WarehousesEntity) => entrepot.conteneurs,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: WarehousesEntity;

  @OneToMany(
    () => DetailBlEntity,
    (detailBls: DetailBlEntity) => detailBls.bl,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  detailBls: DetailBlEntity[];

  @OneToMany(
    () => PottingExecutionEntity,
    (executionEmpotage: PottingExecutionEntity) => executionEmpotage.conteneur,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  executionEmpotage: PottingExecutionEntity[];

  @OneToMany(
    () => ContainerPottingPlanEntity,
    (containerPlanEmpotage: ContainerPottingPlanEntity) =>
      containerPlanEmpotage.conteneur,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  containerPlanEmpotage: ContainerPottingPlanEntity[];

  @OneToOne(() => PlombEntity, (plomb: PlombEntity) => plomb.conteneur, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  plomb: PlombEntity;
}
