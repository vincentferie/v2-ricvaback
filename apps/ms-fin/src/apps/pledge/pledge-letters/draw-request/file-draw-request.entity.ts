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
import { DrawRequestEntity } from './draw-request.entity';

@Entity('file_demande_relache', { schema: 'cashew' })
export class FileDrawRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid', select: false })
  demande_relache_id: UUIDVersion;

  @Column({ type: 'varchar' })
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
    () => DrawRequestEntity,
    (relache: DrawRequestEntity) => relache.file,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'demande_relache_id', referencedColumnName: 'id' })
  relache: DrawRequestEntity;
}
