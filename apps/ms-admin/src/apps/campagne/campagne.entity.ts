import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampagneOutturnEntity } from '../campagne-outturn/outturn.entity';
import { CampagneTrancheEntity } from '../campagne-tranche/tranche.entity';

@Entity('campagne', { schema: 'cashew' })
export class TenantCampagneEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  libelle: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  ouverture: Date;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fermeture: Date;

  @Column({ type: 'boolean' })
  state: boolean;

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
    () => CampagneOutturnEntity,
    (outturn: CampagneOutturnEntity) => outturn.campagne,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  outturn: CampagneOutturnEntity[];

  @OneToMany(
    () => CampagneTrancheEntity,
    (tranche: CampagneTrancheEntity) => tranche.campagne,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  tranche: CampagneTrancheEntity[];
}
