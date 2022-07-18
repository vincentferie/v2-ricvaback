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
import { SubBankAccountEntity } from './sub-account/sub-account.entity';
import { PreFinancingEntity } from '../pre-financing/pre-financing.entity';
import { PledgeProcessingEntity } from '../pledge/pledge-letters/pledge-letters.entity';
import { TenantCampagneEntity } from '../externe/campagne.entity';

@Entity('compte_bancaire', { schema: 'cashew' })
@Index('index_bank_account', ['campagne_id', 'banque_id'], {
  unique: true,
})
export class BankAccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'uuid' })
  banque_id: UUIDVersion;

  @Column({ type: 'bigint' })
  solde: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

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
    (campagne: TenantCampagneEntity) => campagne.banque,
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: TenantCampagneEntity;

  @OneToMany(
    () => SubBankAccountEntity,
    (sousCompte: SubBankAccountEntity) => sousCompte.compteBancaire,
    {
      nullable: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  sousCompte: SubBankAccountEntity[];

  @OneToMany(
    () => PreFinancingEntity,
    (prefinancement: PreFinancingEntity) => prefinancement.compte,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  prefinancement: PreFinancingEntity[];

  @OneToMany(
    () => PledgeProcessingEntity,
    (processNantissement: PledgeProcessingEntity) => processNantissement.compte,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  processNantissement: PledgeProcessingEntity[];
}
