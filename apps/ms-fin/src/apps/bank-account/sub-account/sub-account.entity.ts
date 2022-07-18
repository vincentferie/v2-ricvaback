import { UUIDVersion } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { BankAccountEntity } from '../bank-account.entity';
import { MovementEntity } from '../../../helpers/services/movement/movement.entity';
import { PreFinancingEntity } from '../../pre-financing/pre-financing.entity';
import { PledgeProcessingEntity } from '../../pledge/pledge-letters/pledge-letters.entity';

@Entity('sous_compte_bancaire', { schema: 'cashew' })
@Index('index_sub_bank_account', ['compte_banque_id', 'libelle'], {
  unique: true,
})
export class SubBankAccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  compte_banque_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, nullable: true })
  num_ref: string;

  @Column({ type: 'varchar', length: 150 })
  libelle: string;

  @Column({ type: 'bigint' })
  solde: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
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
    () => BankAccountEntity,
    (compteBancaire: BankAccountEntity) => compteBancaire.sousCompte,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'compte_banque_id', referencedColumnName: 'id' })
  compteBancaire: BankAccountEntity;

  @OneToMany(
    () => MovementEntity,
    (mouvement: MovementEntity) => mouvement.sousCompteBancaire,
    { nullable: false },
  )
  mouvement: MovementEntity[];

  @OneToMany(
    () => PreFinancingEntity,
    (prefinancement: PreFinancingEntity) => prefinancement.compte,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  prefinancement: PreFinancingEntity[];

  @OneToMany(
    () => PledgeProcessingEntity,
    (processNantissement: PledgeProcessingEntity) =>
      processNantissement.sousCompte,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  processNantissement: PledgeProcessingEntity[];
}
