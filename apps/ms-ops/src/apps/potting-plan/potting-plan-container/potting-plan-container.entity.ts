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
  Index,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { PottingPlanEntity } from '../potting-plan.entity';
import { ContainerEntity } from '../../externe/container.entity';

@Entity('plan_empotage_conteneur', { schema: 'cashew' })
@Index('index_empotage_plan_conteneur', ['plan_empotage_id', 'conteneur_id'], {
  unique: true,
})
export class ContainerPottingPlanEntity extends BaseEntity {
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
    (planEmpotage: PottingPlanEntity) => planEmpotage.containerPlanEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'plan_empotage_id', referencedColumnName: 'id' })
  planEmpotage: PottingPlanEntity;

  @ManyToOne(
    () => ContainerEntity,
    (conteneur: ContainerEntity) => conteneur.containerPlanEmpotage,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
  conteneur: ContainerEntity;
}
