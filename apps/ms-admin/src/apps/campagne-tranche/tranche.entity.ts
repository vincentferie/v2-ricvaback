import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Double,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantCampagneEntity } from '../campagne/campagne.entity';

@Entity('campagne_tranche', { schema: 'cashew' })
export class CampagneTrancheEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'varchar', length: 100, unique: true })
  libelle: string;

  @Column({ type: 'float' })
  outturn_min: Double;

  @Column({ type: 'float' })
  outturn_max: Double;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_debut: Date;

  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  date_fin: Date;

  @Column({ type: 'int' })
  prix: number;

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
    () => TenantCampagneEntity,
    (campagne: TenantCampagneEntity) => campagne.tranche,
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: TenantCampagneEntity;
}
