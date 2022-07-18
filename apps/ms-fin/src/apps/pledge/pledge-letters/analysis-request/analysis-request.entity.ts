import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { PledgeProcessingEntity } from '../pledge-letters.entity';
import { FileAnalysisRequestEntity } from './file-analysis-request.entity';

@Entity('demande_analyse', { schema: 'cashew' })
export class AnalysisRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  processus_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  ref: string;

  @Column({ type: 'int' })
  nbr_sacs: number;

  @Column({ type: 'int' })
  poids: number;

  @Column({ type: 'int' })
  nbre_lots: number;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

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
    () => PledgeProcessingEntity,
    (processNantissement: PledgeProcessingEntity) => processNantissement.demandeAnalyse,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'processus_id', referencedColumnName: 'id' })
  processNantissement: PledgeProcessingEntity;

  @OneToOne(
    () => FileAnalysisRequestEntity,
    (file: FileAnalysisRequestEntity) => file.analyse,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  file: FileAnalysisRequestEntity;
}
