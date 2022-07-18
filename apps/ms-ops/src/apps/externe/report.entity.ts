import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LotEntity } from './lot.entity';
import { UnloadingEntity } from './unloading.entity';
import { AccountEntity } from './account.entity';

@Entity('signaler_lot', { schema: 'cashew' })
export class ReportWarnEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  dechargement_id: UUIDVersion;

  @Column({ type: 'uuid', nullable: true })
  lot_id: UUIDVersion;

  @Column({ type: 'uuid' })
  superviseur_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  motif: string;

  @Column({ type: 'varchar', length: 255 })
  text: string;

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
    () => UnloadingEntity,
    (dechargement: UnloadingEntity) => dechargement.signaler,
    {
      nullable: true,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'dechargement_id', referencedColumnName: 'id' })
  dechargement: UnloadingEntity;

  @ManyToOne(() => LotEntity, (lot: LotEntity) => lot.signaler, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;

  @ManyToOne(
    () => AccountEntity,
    (superviseur: AccountEntity) => superviseur.signaler,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;
}
