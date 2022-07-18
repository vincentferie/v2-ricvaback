import { UUIDVersion } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Double,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { PledgeProcessingEntity } from '../pledge/pledge-letters/pledge-letters.entity';

@Entity('entrepot', { schema: 'cashew' })
export class WarehousesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  site_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  libelle: string;

  @Column({ type: 'float', nullable: true })
  superficie: Double;

  @Column({ type: 'float', nullable: true })
  coordonneex: Double;

  @Column({ type: 'float', nullable: true })
  coordonneey: Double;

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
    () => PledgeProcessingEntity,
    (processNantissement: PledgeProcessingEntity) =>
      processNantissement.entrepot,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  processNantissement: PledgeProcessingEntity[];
}
