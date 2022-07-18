import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Double,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampagneSpecEntity } from '@app/saas-component/settings/campagne/details/campagne-spec.entity';
import { BaseUrlEntity } from '@app/saas-component/settings/base-url/base-url.entity';
import { UUIDVersion } from 'class-validator';

@Entity('campagne', { database: 'ricva_master' })
export class CampagneEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  speculation_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  libelle: string;

  @Column({ type: 'decimal' })
  prix_bord: Double;

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
    () => BaseUrlEntity,
    (speculation: BaseUrlEntity) => speculation.campagne,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'speculation_id', referencedColumnName: 'id' })
  speculation: BaseUrlEntity;

  @OneToMany(
    () => CampagneSpecEntity,
    (detailsCampagne: CampagneSpecEntity) => detailsCampagne.campagne,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  detailsCampagne: CampagneSpecEntity[];
}
