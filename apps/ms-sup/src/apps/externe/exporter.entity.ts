import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CessionEntity } from '../lots/cession/cession.entity';
import { UnloadingEntity } from '../unloading/unloading.entity';

@Entity('exportateur', { schema: 'cashew' })
export class ExporterEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  raison: string;

  @Column({ type: 'varchar', length: 150 })
  contribuable: string;

  @Column({ type: 'varchar', length: 30 })
  contact: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  postal: string;

  @Column({ type: 'varchar', length: 255 })
  lieu: string;

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
    () => UnloadingEntity,
    (dechargements: UnloadingEntity) => dechargements.exportateur,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  dechargements: UnloadingEntity[];

  @OneToMany(
    () => CessionEntity,
    (cessionLotCedant: CessionEntity) => cessionLotCedant.cedant,
    {
      nullable: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  cessionLotCedant: CessionEntity[];

  @OneToMany(
    () => CessionEntity,
    (cessionLotRecevant: CessionEntity) => cessionLotRecevant.recevant,
    {
      nullable: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  cessionLotRecevant: CessionEntity[];
}
