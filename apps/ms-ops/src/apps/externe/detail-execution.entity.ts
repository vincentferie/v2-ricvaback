import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LotEntity } from './lot.entity';
import { PottingExecutionEntity } from './potting-execution.entity';

@Entity('detail_execution_empotage', { schema: 'cashew' })
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
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;

  @ManyToOne(
    () => PottingExecutionEntity,
    (executionEmpotage: PottingExecutionEntity) => executionEmpotage.details,
    { nullable: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'plan_execution_id', referencedColumnName: 'id' })
  executionEmpotage: PottingExecutionEntity;
}
