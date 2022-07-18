import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LotEntity } from '../../lots/lot.entity';
import { PottingExecutionEntity } from '../potting-execution.entity';

@Entity('detail_execution_empotage', { schema: 'cashew' })
@Index('index_execution_plan_lot', ['plan_execution_id', 'lot_id'], {
  unique: true,
})
export class DetailsExecutionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  plan_execution_id: UUIDVersion;

  @Column({ type: 'uuid' })
  lot_id: UUIDVersion;

  @Column({ type: 'int', nullable: true })
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

  @ManyToOne(() => LotEntity, (lot: LotEntity) => lot.detailExecutionEmpotage, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;

  @ManyToOne(
    () => PottingExecutionEntity,
    (executionEmpotage: PottingExecutionEntity) => executionEmpotage.details,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'plan_execution_id', referencedColumnName: 'id' })
  executionEmpotage: PottingExecutionEntity;
}
