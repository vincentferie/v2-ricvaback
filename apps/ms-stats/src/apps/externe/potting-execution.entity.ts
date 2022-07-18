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
import { DetailsExecutionEntity } from './detail-execution.entity';
import { PottingPlanEntity } from './potting-plan.entity';
import { ContainerEntity } from './container.entity';

@Entity('execution_empotage', { schema: 'cashew' })
export class PottingExecutionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  plan_empotage_id: UUIDVersion;

  @Column({ type: 'uuid' })
  conteneur_id: UUIDVersion;

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

  @OneToMany(
    () => DetailsExecutionEntity,
    (details: DetailsExecutionEntity) => details.executionEmpotage,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  details: DetailsExecutionEntity[];

  @ManyToOne(
    () => PottingPlanEntity,
    (planEmpotage: PottingPlanEntity) => planEmpotage.executionEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'plan_empotage_id', referencedColumnName: 'id' })
  planEmpotage: PottingPlanEntity;

  @ManyToOne(
    () => ContainerEntity,
    (conteneur: ContainerEntity) => conteneur.executionEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
  conteneur: ContainerEntity;
}
