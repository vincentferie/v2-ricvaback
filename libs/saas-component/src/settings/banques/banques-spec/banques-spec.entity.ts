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
import { BanquesEntity } from '../banques.entity';

@Entity('banques_spec', { database: 'ricva_master' })
export class BanquesSpecEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  banque_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  ligne: string;

  @Column({ type: 'bigint', nullable: true })
  montant: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'smallint', nullable: true })
  duree: number;

  @Column({ type: 'date', nullable: true })
  echeance: Date;

  @Column({ type: 'float', nullable: true })
  taux: Double;

  @Column({ type: 'bigint', nullable: true })
  hauteur_tirage: number;

  @Column({ type: 'smallint', nullable: true })
  duree_tirage: number;

  @Column({ type: 'bigint', nullable: true })
  compte_sequestre: number;

  @Column({ type: 'bigint', nullable: true })
  frais_tirage: number;

  @Column({ type: 'bigint', nullable: true })
  flat: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  libelle_garantie: string;

  @Column({ type: 'bigint', nullable: true })
  depot_garantie: number;

  @Column({ type: 'bigint', nullable: true })
  limite_garantie: number;

  @Column({ type: 'float', nullable: true })
  frais_dossier: Double;

  @Column({ type: 'float', nullable: true })
  frais_struct: Double;

  @Column({ type: 'float', nullable: true })
  cmm_mvt: Double;

  @Column({ type: 'float', nullable: true })
  comm_ft_dcrt: Double;

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

  @ManyToOne(() => BanquesEntity, (banques: BanquesEntity) => banques.details, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
  banques: BanquesEntity;
}
