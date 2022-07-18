import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantCampagneEntity } from '../externe/campagne.entity';
import { DetailBlEntity } from './details-bl/detail-bl.entity';
import { FileBillOfLadingEntity } from './file-bl/file-bl.entity';

@Entity('bill_lading', { schema: 'cashew' })
export class BillOfLadingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'varchar', length: 50, unique: true })
  numero_bl: string;

  @Column({ type: 'varchar', length: 50 })
  numero_voyage: string;

  @Column({ type: 'varchar', length: 150 })
  destination: string;

  @Column({ type: 'varchar', length: 150 })
  provenance: string;

  @Column({ type: 'varchar', length: 150 })
  amateur: string;

  @Column({ type: 'varchar', length: 150 })
  nom_client: string;

  @Column({ type: 'varchar', length: 150 })
  adresse_client: string;

  @Column({ type: 'varchar', length: 150 })
  pays_client: string;

  @Column({ type: 'varchar', length: 150 })
  port_depart: string;

  @Column({ type: 'varchar', length: 150 })
  port_arrive: string;

  @Column({ type: 'timestamp without time zone' })
  date_embarquement: Date;

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

  @ManyToOne(() => TenantCampagneEntity, (campagne: TenantCampagneEntity) => campagne.bl, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: TenantCampagneEntity;

  @OneToOne(
    () => FileBillOfLadingEntity,
    (file: FileBillOfLadingEntity) => file.billOfLading,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  file: FileBillOfLadingEntity;

  @OneToMany(
    () => DetailBlEntity,
    (detailBls: DetailBlEntity) => detailBls.bl,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  detailBls: DetailBlEntity[];
}
