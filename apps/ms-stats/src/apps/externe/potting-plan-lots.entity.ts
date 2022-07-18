import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { PottingPlanEntity } from './potting-plan.entity';
import { LotEntity } from './lot.entity';

@Entity('plan_empotage_lots', { schema: 'cashew' })
export class LotPottingPlanEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  plan_empotage_id: UUIDVersion;

  @Column({ type: 'uuid' })
  lot_id: UUIDVersion;

  @Column({ type: 'int' })
  nbr_sacs: number;

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
    () => PottingPlanEntity,
    (planEmpotage: PottingPlanEntity) => planEmpotage.lotPlanEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'plan_empotage_id', referencedColumnName: 'id' })
  planEmpotage: PottingPlanEntity;

  @ManyToOne(() => LotEntity, (lot: LotEntity) => lot.lotPlanEmpotage, {
    nullable: false,

    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;
}
