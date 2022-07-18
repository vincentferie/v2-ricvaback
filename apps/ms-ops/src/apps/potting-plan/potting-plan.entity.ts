import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { StateBooking } from '@app/saas-component/helpers/enums';
import { ContainerPottingPlanEntity } from './potting-plan-container/potting-plan-container.entity';
import { LotPottingPlanEntity } from './potting-plan-lots/potting-plan-lots.entity';
import { WarehousesEntity } from '../externe/warehouses.entity';
import { PottingExecutionEntity } from '../externe/potting-execution.entity';
import { ForwarderEntity } from '../externe/forwarder.entity';

@Entity('plan_empotage', { schema: 'cashew' })
export class PottingPlanEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_id: UUIDVersion;

  @Column({ type: 'uuid' })
  transitaire_id: UUIDVersion;

  @Column({ type: 'varchar', length: 50, unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: StateBooking,
    default: StateBooking.encours,
  })
  state: StateBooking;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_execution: Date;

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
    (entrepot: WarehousesEntity) => entrepot.planEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: WarehousesEntity;

  @ManyToOne(
    () => ForwarderEntity,
    (transitaire: ForwarderEntity) => transitaire.planEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'transitaire_id', referencedColumnName: 'id' })
  transitaire: ForwarderEntity;

  @OneToMany(
    () => ContainerPottingPlanEntity,
    (containerPlanEmpotage: ContainerPottingPlanEntity) =>
      containerPlanEmpotage.planEmpotage,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  containerPlanEmpotage: ContainerPottingPlanEntity[];

  @OneToMany(
    () => LotPottingPlanEntity,
    (lotPlanEmpotage: LotPottingPlanEntity) => lotPlanEmpotage.planEmpotage,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  lotPlanEmpotage: LotPottingPlanEntity[];

  @OneToMany(
    () => PottingExecutionEntity,
    (executionEmpotage: PottingExecutionEntity) =>
      executionEmpotage.planEmpotage,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  executionEmpotage: PottingExecutionEntity[];
}
