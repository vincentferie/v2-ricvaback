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
import { BillOfLadingEntity } from '../bill_of_lading/bl.entity';
import { LotEntity } from './lot.entity';
import { UnloadingEntity } from './unloading.entity';

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
    () => UnloadingEntity,
    (dechargements: UnloadingEntity) => dechargements.campagne,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  dechargements: UnloadingEntity[];

  @OneToMany(() => LotEntity, (lots: LotEntity) => lots.campagne, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  lots: LotEntity[];

  @OneToMany(
    () => BillOfLadingEntity,
    (bl: BillOfLadingEntity) => bl.campagne,
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  bl: BillOfLadingEntity[];
}
