import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UnloadingEntity } from './unloading.entity';

@Entity('file_dechargement', { schema: 'cashew' })
export class FileUnloadingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  dechargement_id: UUIDVersion;

  @Column({ type: 'varchar', unique: true })
  filename: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'int', nullable: true })
  aws_id: number;

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

  @OneToOne(
    () => UnloadingEntity,
    (dechargement: UnloadingEntity) => dechargement.file,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'dechargement_id', referencedColumnName: 'id' })
  dechargement: UnloadingEntity;
}
