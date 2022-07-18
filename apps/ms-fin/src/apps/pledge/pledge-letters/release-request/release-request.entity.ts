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
import { FileReleaseRequestEntity } from './file-release-request.entity';

@Entity('demande_relache', { schema: 'cashew' })
export class ReleaseRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  processus_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  ltd: string;

  @Column({ type: 'int' })
  nbr_sacs: number;

  @Column({ type: 'bigint' })
  valeur: number;

  @Column({ type: 'bigint' })
  tirage: number;

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
    (processNantissement: PledgeProcessingEntity) => processNantissement.demandeTirage,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'processus_id', referencedColumnName: 'id' })
  processNantissement: PledgeProcessingEntity;

  @OneToOne(
    () => FileReleaseRequestEntity,
    (file: FileReleaseRequestEntity) => file.tirage,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  file: FileReleaseRequestEntity;
}
