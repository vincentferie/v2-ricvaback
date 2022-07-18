import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { ExporterEntity } from '../externe/exporter.entity';
import { StateTirage } from '@app/saas-component/helpers/enums';
import { SubBankAccountEntity } from '../bank-account/sub-account/sub-account.entity';
import { BankAccountEntity } from '../bank-account/bank-account.entity';
import { TenantCampagneEntity } from '../externe/campagne.entity';

@Entity('prefinancement', { schema: 'cashew' })
@Index(
  'index_campagne_exporter_bank_number',
  [
    'campagne_id',
    'exportateur_id',
    'compte_banque_id',
    'sous_compte_banque_id',
    'numero',
  ],
  { unique: true },
)
export class PreFinancingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'uuid' })
  compte_banque_id: UUIDVersion;

  @Column({ type: 'uuid' })
  sous_compte_banque_id: UUIDVersion;

  @Column({ type: 'uuid' })
  exportateur_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  numero: string;

  @Column({ type: 'bigint' })
  solde: number;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_tirage: Date;

  @Column({ type: 'enum', enum: StateTirage, default: StateTirage.decouvert })
  type: StateTirage;

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
    (campagne: TenantCampagneEntity) => campagne.prefinancement,
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: TenantCampagneEntity;

  @ManyToOne(
    () => ExporterEntity,
    (exportateur: ExporterEntity) => exportateur.prefinancement,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
  exportateur: ExporterEntity;

  @ManyToOne(
    () => BankAccountEntity,
    (compte: BankAccountEntity) => compte.prefinancement,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'compte_banque_id', referencedColumnName: 'id' })
  compte: BankAccountEntity;

  @ManyToOne(
    () => SubBankAccountEntity,
    (sousCompte: SubBankAccountEntity) => sousCompte.prefinancement,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'sous_compte_banque_id', referencedColumnName: 'id' })
  sousCompte: SubBankAccountEntity;
}
